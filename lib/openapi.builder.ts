import {INestApplication, Type} from "@nestjs/common";
import {
  IOpenApiDocumentOptions,
  IOpenApiDocumentOverrideResponse,
  IOpenApiDocumentOverrideResponseStatus,
  OpenApiDocument
} from "./interfaces/document.interface";
import {IOpenApiScannedController, OpenApiScanner} from "./openapi.scanner";
import {IOpenApiTagGroupMetadata, IOpenApiTagMetadata} from "./interfaces/common.interface";
import {ClassEntryMethod} from "./utils/class.utils";
import {DECORATORS} from "./constants/metadata.constants";
import {createSlug, pascalCase, uniqueMergeBy} from "./utils/common.utils";
import {ApiResponseOptions} from "@nestjs/swagger/dist/decorators/api-response.decorator";
import {isClassRef, isPlainObject} from "./utils/type.utils";
import {getSchemaPath, OmitType} from "@nestjs/swagger";
import {generateSchemaType} from "./utils/schema.utils";
import {MetadataAccessor} from "./utils/metadata.utils";

interface IOpenApiBuilderTagGroup extends Omit<IOpenApiTagGroupMetadata, 'tags'> {
  tags: IOpenApiTagMetadata[];
  controllers: IOpenApiBuilderController<true>[]; // defines the controllers that belong to this tagGroup
  methods: IOpenApiBuilderMethod<true>[]; // defines the methods that belong to this tagGroup
}

interface IOpenApiBuilderController<MustHaveTagGroup extends boolean> {
  controller: IOpenApiScannedController;
  tagGroup: MustHaveTagGroup extends true ? IOpenApiTagGroupMetadata : IOpenApiTagGroupMetadata | null;
  tags: IOpenApiTagMetadata[];
}

interface IOpenApiBuilderMethod<MustHaveTagGroup extends boolean> {
  controller: IOpenApiScannedController;
  method: ClassEntryMethod;
  tagGroup: MustHaveTagGroup extends true ? IOpenApiTagGroupMetadata : IOpenApiTagGroupMetadata | null;
  tags: IOpenApiTagMetadata[];
}

interface IOpenApiBuilderResponse {
  status: IOpenApiDocumentOverrideResponseStatus;
  controller: IOpenApiScannedController;
  method?: ClassEntryMethod;
  override: IOpenApiBuilderResponseOverride;
  options: ApiResponseOptions;
}

interface IOpenApiBuilderResponseOverride extends IOpenApiDocumentOverrideResponse {
  status: IOpenApiDocumentOverrideResponseStatus;
}

export class OpenApiBuilder {
  constructor(
    private readonly app: INestApplication,
    private readonly config: Omit<OpenApiDocument, 'paths'>,
    private readonly opts: IOpenApiDocumentOptions,
  ){}

  /**
   * Retrieves the OpenApiScanner instance associated with the current application.
   * This method ensures that the OpenApiScanner is lazily initialized and cached.
   *
   * @return {OpenApiScanner} The OpenApiScanner instance managing the application's scanning functionality.
   */
  private get scanner(): OpenApiScanner {
    const self = (this as any);
    self._scanner = self._scanner || new OpenApiScanner(this.app);
    return self._scanner;
  }

  /**
   * Retrieves the options for the OpenAPI document, ensuring all required fields are populated with defaults if not provided.
   *
   * @return {Required<IOpenApiDocumentOptions>} A complete set of OpenAPI document options with default values for missing properties.
   */
  private get options(): Required<IOpenApiDocumentOptions> {
    return {
      uniqueTagGroupTags: this.opts.uniqueTagGroupTags ?? true,
      uniqueTagGroupTagNameFactory: this.opts.uniqueTagGroupTagNameFactory || ((groupName: string, tagName: string) => [groupName, tagName].map(pascalCase).join('/')),
      tagGroupUngrouped: this.opts.tagGroupUngrouped || false,
      responseOverrides: this.opts.responseOverrides || {},
      responseOverrideModelNameFactory: this.opts.responseOverrideModelNameFactory === false
        ? false
        : this.opts.responseOverrideModelNameFactory === true
          ? defaultResponseOverrideModelNameFactory
          : this.opts.responseOverrideModelNameFactory || defaultResponseOverrideModelNameFactory,
    } as Required<IOpenApiDocumentOptions>;
  }

  /**
   * Builds and returns the OpenApiDocument configuration excluding the 'paths' property.
   * The method performs several intermediate steps such as building tag groups, tags,
   * and response overrides to create the necessary configuration.
   *
   * @return {Omit<OpenApiDocument, 'paths'>} The OpenApiDocument configuration without the 'paths' property.
   */
  build(): Omit<OpenApiDocument, 'paths'> {

    // we first need to build the tagGroups so the tags can be resolved correctly.
    this.buildTagGroups();

    // then we can build the tags.
    this.buildTags();

    // then we can build the response overrides.
    this.buildResponseOverrides();

    // return the config.
    return this.config;

  }

  /**
   * Builds and organizes tag groups from controllers and methods for use in the OpenAPI schema.
   * This method processes controllers and methods to associate them with specific tag groups,
   * ensures the tags are added to global decorators, and updates the OpenAPI configuration with
   * the structured tag groups data.
   *
   * @return {void} No return value. The method updates the internal OpenAPI configuration directly.
   */
  private buildTagGroups(): void {

    // we need to get all controllers and methods
    const { controllers, methods } = {
      controllers: this.getControllersWithTagGroup(),
      methods: this.getMethodsWithTagGroup(),
    };

    // we need to create an array for tagGroups
    const tagGroups: IOpenApiBuilderTagGroup[] = [];

    // add groups from controllers and methods
    controllers.map(item => this.addTagGroup(item.tagGroup, tagGroups).controllers.push(item));
    methods.map(item => this.addTagGroup(item.tagGroup, tagGroups).methods.push(item));

    // transform tags from controllers
    tagGroups.map(tagGroup => tagGroup.controllers.map(item => {
      const tags = item.tags.map(tag => this.addTagToTagGroup(tagGroup, tag));
      DECORATORS.OPENAPI.TAGS.set(tags, item.controller.type);
      DECORATORS.SWAGGER.TAGS.set(tags.map(tag => tag.name), item.controller.type);
    }));

    // transform tags from method
    tagGroups.map(tagGroup => tagGroup.methods.map(item => {
      const tags = item.tags.map(tag => this.addTagToTagGroup(tagGroup, tag));
      DECORATORS.OPENAPI.TAGS.set(tags, item.method.descriptor.value);
      DECORATORS.SWAGGER.TAGS.set(tags.map(tag => tag.name), item.method.descriptor.value);
    }));

    // add tagGroups to OpenAPI schema
    this.config['x-tagGroups'] = uniqueMergeBy('name', [
      (this.config['x-tagGroups'] || []),
      tagGroups.map(group => ({
        name: group.name,
        description: group.description,
        tags: group.tags.map(tag => tag.name)
      }))
    ].flat());

  }

  /**
   * Builds and organizes tags for the OpenAPI schema by extracting tags from controllers and methods,
   * ensuring they are unique, and updating the configuration with these tags.
   *
   * @return {void} This method does not return a value.
   */
  private buildTags(): void {

    // we need to get all controllers and methods
    const { controllers, methods } = {
      controllers: this.getControllers(),
      methods: this.getControllers(),
    };

    // we need to create an array for tags
    const tags: IOpenApiTagMetadata[] = [];

    // extract and get all tags
    controllers.map(controller => controller.tags.map(tag => this.addTag(tag, tags)));
    methods.map(method => method.tags.map(tag => this.addTag(tag, tags)));

    // add tagGroups to OpenAPI schema
    this.config.tags = uniqueMergeBy('name', [
      (this.config['tags'] || []),
      tags.map(tag => ({
        name: tag.name,
        'x-displayName': tag.displayName,
        description: tag.description,
        'x-traitTag': tag.trait,
      }))
    ].flat());

  }

  /**
   * Builds and applies response overrides by transforming response options and models.
   * It generates and associates schema definitions, manages extra models, and configures
   * responses with overrides mapped to the respective controller or method.
   *
   * @return {void} This method does not return a value.
   */
  private buildResponseOverrides(): void {

    // create an array for extra models so we don't call the @ExtraModels multiple times
    const extraModels: any[] = [];

    // transform options of all responses with overrides
    const responses: [any, string, ApiResponseOptions][] = this.getResponses().map((response) => {

      // define required variables
      const status = response.status.toString();
      const override = response.override;
      const target = response.method?.descriptor.value || response.controller.type;
      const options: any = response.options;

      // just apply the override if no subKey is provided
      if(!override.subKey){
        return [target, status, {
          schema: {
            $ref: this.addExtraModel(override.type, extraModels, target)
          }
        }];
      }

      // generate override model
      const overrideModel = this.generateExtraModel(options, override.subKey, override.type, extraModels, target);

      // check if the type is defined
      if(options.type){
        const responseModel = this.addExtraModel(options.type, extraModels, target);
        return [target, status, {
          schema: {
            allOf: [
              { $ref: overrideModel },
              {
                type: 'object',
                properties: options.isArray
                ? {[override.subKey]: { type: 'array', items: { $ref: responseModel }}}
                : {[override.subKey]: { $ref: responseModel }}
              },
            ],
          }
        }];
      }

      // return options
      return [target, status, options];

    });

    // apply new responses
    responses.map(([target, status, options]) => DECORATORS.SWAGGER.RESPONSES.set(status, options, target));

  }

  /**
   * Retrieves controllers that are associated with a specific tag group.
   * This method scans all available controllers, enriches them with tag group metadata.
   *
   * @return {IOpenApiBuilderController[]} An array of controllers.
   */
  private getControllers(): IOpenApiBuilderController<false>[] {
    return this.scanner.getControllers()
      .map(controller => ({
        controller: controller,
        tagGroup: this.getNearestTagGroup(controller),
        tags: uniqueMergeBy<IOpenApiTagMetadata>('name', [
          (DECORATORS.OPENAPI.TAGS.get(controller.type) || []),
          (DECORATORS.SWAGGER.TAGS.get(controller.type) || []).map(_ => ({name: _})),
        ].flat()),
      }))
      .map(controller => {
        controller.tagGroup = controller.tagGroup ?? this.getTagGroupUngrouped();
        return controller;
      })
  }

  /**
   * Retrieves an array of controllers that belong to a tag group.
   *
   * @return {IOpenApiBuilderController<true>[]} An array of controllers that contain a tag group.
   */
  private getControllersWithTagGroup(): IOpenApiBuilderController<true>[] {
    return this.getControllers().filter((item) => !!item.tagGroup) as any;
  }

  /**
   * Retrieves an array of methods that belong to a specified tag group.
   * It scans through all controllers and their methods, associates them with
   * their respective tag groups and tags metadata.
   *
   * @return {IOpenApiBuilderMethod[]} An array of objects representing the methods
   *                                   paired with their tag group and tag metadata.
   */
  private getMethods(): IOpenApiBuilderMethod<false>[] {
    return this.scanner.getControllers()
      .map(controller => controller.methods.map(method => ({
        controller: controller,
        method: method,
        tagGroup: this.getNearestTagGroup(controller, method),
        tags: uniqueMergeBy<IOpenApiTagMetadata>('name', [
          (DECORATORS.OPENAPI.TAGS.get(method.descriptor.value) || []),
          (DECORATORS.SWAGGER.TAGS.get(method.descriptor.value) || []).map(_ => ({name: _}))
        ].flat()),
      }))).flat()
      .map(method => {
        method.tagGroup = method.tagGroup ?? this.getTagGroupUngrouped();
        return method;
      })
  }

  /**
   * Retrieves all methods that belong to a tag group from the OpenAPI builder.
   *
   * @return {IOpenApiBuilderMethod<true>[]} An array containing methods that are associated with a tag group.
   */
  private getMethodsWithTagGroup(): IOpenApiBuilderMethod<true>[] {
    return this.getMethods().filter((item) => !!item.tagGroup) as any;
  }

  /**
   * Retrieves a list of OpenAPI builder responses by processing the controllers and methods.
   *
   * The method constructs an array of response objects by analyzing and extracting
   * response details from the associated controllers and methods, using decorators
   * to identify and normalize response metadata.
   *
   * @return {IOpenApiBuilderResponse[]} An array of response objects, each containing status, controller, method (if available), and options.
   */
  private getResponses(): IOpenApiBuilderResponse[] {

    // create array for responses
    const responses: IOpenApiBuilderResponse[] = [];

    // find all responses from controllers and methods
    this.getControllers().map(item => {
      const data = DECORATORS.SWAGGER.RESPONSES.getAll(item.controller.type);
      if(isPlainObject(data)){
        Object.entries(data).map(([status, options]) => {
          const override = this.getNearestResponseOverride(status);
          if(override){
            responses.push({
              status: this.normalizeStatus(status),
              controller: item.controller,
              options: options,
              override: override,
            });
          }
        });
      }
    });

    // find all responses from methods
    this.getMethods().map(item => {
      const data = DECORATORS.SWAGGER.RESPONSES.getAll(item.method.descriptor.value);
      if(isPlainObject(data)){
        Object.entries(data).map(([status, options]) => {
          const override = this.getNearestResponseOverride(status);
          if(override){
            responses.push({
              status: this.normalizeStatus(status),
              controller: item.controller,
              method: item.method,
              options: options,
              override: override,
            });
          }
        });
      }
    });

    // return responses
    return responses;

  }

  /**
   * Finds the related tag group metadata associated with the provided controller or method.
   *
   * @param {IOpenApiScannedController} controller - The controller to scan for related tag group metadata.
   * @param {ClassEntryMethod} [method] - An optional method to check for associated tag group metadata.
   * @return {IOpenApiTagGroupMetadata | null} The related tag group metadata if found, otherwise null.
   */
  private getNearestTagGroup(controller: IOpenApiScannedController, method?: ClassEntryMethod): IOpenApiTagGroupMetadata | null {
    return (
      (method && DECORATORS.OPENAPI.TAG_GROUPS.get(method.descriptor.value)) ||
      DECORATORS.OPENAPI.TAG_GROUPS.get(controller.type) ||
      controller.parents.map(p => DECORATORS.OPENAPI.TAG_GROUPS.get(p.type)).find(Boolean) ||
      null
    );
  }

  /**
   * Retrieves metadata for the 'Ungrouped' tag group configuration.
   *
   * The method checks if the option `tagGroupUngrouped` is defined and determines its value to return
   * the corresponding metadata. If the value is:
   * - `true`: The method returns a tag group metadata object with the name 'Ungrouped'.
   * - A string: The method returns a tag group metadata object with the name set to the string value.
   * - An object conforming to IOpenApiTagGroupMetadata: The method returns it as is.
   * If `tagGroupUngrouped` is not defined, it returns null.
   *
   * @return {IOpenApiTagGroupMetadata|null} The metadata for the 'Ungrouped' tag group or null if not configured.
   */
  private getTagGroupUngrouped(): IOpenApiTagGroupMetadata|null {
    if(this.options.tagGroupUngrouped){
      const tagGroup = this.options.tagGroupUngrouped;
      return tagGroup === true ? { name: 'Ungrouped' } : typeof tagGroup === 'string' ? { name: tagGroup } : tagGroup;
    }
    return null;
  }

  /**
   * Adds a tag group to the list of existing groups. If a group with the same name
   * (case-insensitive) already exists, it updates its description if not defined.
   * Otherwise, it creates a new tag group.
   *
   * @param group The metadata of the tag group to add, including its name and description.
   * @param groups The array of currently existing tag groups to which the new group will be added.
   * @return The newly added or updated tag group object.
   */
  private addTagGroup(group: IOpenApiTagGroupMetadata, groups: IOpenApiBuilderTagGroup[]): IOpenApiBuilderTagGroup {
    const key = group.name.trim().toLowerCase();
    const existing = groups.find(g => createSlug(g.name) === createSlug(key)) ?? (groups[groups.push({
      name: group.name,
      tags: [],
      controllers: [],
      methods: [],
    }) - 1]);
    existing.description ||= group.description;
    return existing;
  }

  /**
   * Adds a tag to the specified tag group. If the tag does not already exist in the group, it will be added.
   *
   * @param {IOpenApiBuilderTagGroup} group - The tag group to which the tag will be added.
   * @param {string | IOpenApiTagMetadata} value - The tag value, which can be a string or an object containing tag metadata.
   * @return {IOpenApiTagMetadata} The added or transformed tag object.
   */
  private addTagToTagGroup(group: IOpenApiBuilderTagGroup, value: string|IOpenApiTagMetadata): IOpenApiTagMetadata {
    const tag = this.transformTag(group, value);
    const existing = group.tags.find(t => createSlug(t.name) === createSlug(tag.name)) ?? (group.tags[group.tags.push({
      name: tag.name,
    }) - 1]);
    existing.displayName ||= tag.displayName;
    existing.description ||= tag.description;
    existing.trait ??= tag.trait;
    return existing;
  }

  /**
   * Adds a new tag to the tags array if it does not already exist based on its slugified name.
   * Updates the existing tag with missing properties if the tag already exists.
   *
   * @param {IOpenApiTagMetadata} tag - The tag metadata to add or update.
   * @param {IOpenApiTagMetadata[]} tags - The array of existing tag metadata to search and modify.
   * @return {IOpenApiTagMetadata} The added or updated tag metadata.
   */
  private addTag(tag: IOpenApiTagMetadata, tags: IOpenApiTagMetadata[]): IOpenApiTagMetadata {
    const existing = tags.find(g => createSlug(g.name) === createSlug(tag.name)) ?? (tags[tags.push({
      name: tag.name,
    }) - 1]);
    existing.displayName ||= tag.displayName;
    existing.description ||= tag.description;
    existing.trait ??= tag.trait;
    return existing;
  }

  /**
   * Transforms a tag by combining the group name and the tag's name
   * using snake_case formatting. If the tag name changes after transformation,
   * the original name is saved as `displayName` if it is not already set.
   *
   * @param group - The tag group metadata including the group name.
   * @param value - The tag information, which can be a string representing
   *                the tag name or an object containing tag metadata.
   * @return The transformed tag metadata with the updated tag name.
   */
  private transformTag(group: IOpenApiBuilderTagGroup, value: string | IOpenApiTagMetadata): IOpenApiTagMetadata {
    const tag: IOpenApiTagMetadata = typeof value === 'string' ? { name: value } : { ...value };
    const newName = this.options.uniqueTagGroupTagNameFactory(group.name, tag.name);
    if (this.options.uniqueTagGroupTags && tag.name !== newName) {
      tag.displayName ??= tag.name;
      tag.name = newName;
    }
    return tag;
  }

  /**
   * Retrieves the nearest response override based on the given status code or status group.
   *
   * @param {string | number} status - The HTTP status code or status group (e.g., 200, "2XX") for which to find the override.
   * @return {IOpenApiBuilderResponseOverride | null} The matched response override if available, or null if no match is found.
   */
  private getNearestResponseOverride(status: string | number): IOpenApiBuilderResponseOverride | null {

    // get all overrides
    const overrides: Map<any, any> = this.getOverrideResponses();

    // normalize status
    const normalizedStatus = this.normalizeStatus(status);

    // helper function to get named override
    const namedFromClass = (cls: number, combineError: boolean = false) => {
      switch (cls) {
        case 1: return 'info';
        case 2: return 'success';
        case 3: return 'redirect';
        case 4: return combineError ? 'error' : 'clientError';
        case 5: return combineError ? 'error' : 'serverError';
        default: return undefined;
      }
    };

    // exact match for the provided key (number, "503", "2XX", ...)
    if (overrides.has(normalizedStatus)) {
      return overrides.get(normalizedStatus) as IOpenApiBuilderResponseOverride;
    }

    // number cascade: 'Xxx' -> named -> default
    if(typeof normalizedStatus === 'number' && Number.isFinite(normalizedStatus)){
      const cls = Math.floor(normalizedStatus / 100);
      const group = `${cls}XX`;
      if(overrides.has(group)){
        return overrides.get(group);
      }
      const named = namedFromClass(cls);
      const namedCombined = namedFromClass(cls, true);
      return (named && overrides.has(named)) ? overrides.get(named) : (namedCombined && overrides.has(namedCombined)) ? overrides.get(namedCombined) : overrides.get('default') || null;
    }

    // group cascade: '2XX' -> named -> default
    if (typeof status === 'string' && /^[1-5]XX$/.test(status)) {
      const cls = Number(status[0]);
      const named = namedFromClass(cls);
      const namedCombined = namedFromClass(cls, true);
      return (named && overrides.has(named)) ? overrides.get(named) : (namedCombined && overrides.has(namedCombined)) ? overrides.get(namedCombined) : overrides.get('default') || null;
    }

    // fallback
    return overrides.get('default') || null;

  }

  /**
   * Processes and normalizes response overrides provided in the options and transforms them into an array of override response objects.
   *
   * @return {IOpenApiDocumentOverrideResponse[]} An array of normalized override response objects derived from the provided response overrides.
   */
  private getOverrideResponses(): Map<IOpenApiDocumentOverrideResponseStatus, IOpenApiBuilderResponseOverride> {
    return new Map(Object.entries(this.options.responseOverrides)
      .map(([status, data]) => {
        if(isPlainObject(data)){
          return {
            status: this.normalizeStatus(status),
            ...data,
          };
        }else if(Array.isArray(data)){
          return {
            status: this.normalizeStatus(status),
            type: data[0],
            subKey: data[1],
          }
        }else if(isClassRef(data)){
          return {
            status: this.normalizeStatus(status),
            type: data,
          }
        }
        return null;
      })
      .filter(i => !!i)
      .map(i => ([i.status as any, i]))
    ) as any;
  }

  /**
   * Adds an extra model to the provided models list and updates the target with the model if it is not already included.
   *
   * @param {Type<unknown>} model - The model to be added.
   * @param {Type<unknown>[]} models - The existing list of models.
   * @param {any} target - The target to associate the model with.
   * @return {string} The schema path of the added model.
   */
  private addExtraModel(model: Type<unknown>, models: Type<unknown>[], target: any): string {
    if(!models.includes(model)){
      DECORATORS.SWAGGER.EXTRA_MODELS.add(model, target);
      models.push(model);
    }
    return getSchemaPath(model);
  }

  /**
   * Generates an additional model dynamically based on the provided options and parameters.
   *
   * @param {ApiResponseOptions} options Options to configure the API response schema.
   * @param {string} key The key corresponding to the property whose schema needs to be updated or generated.
   * @param {Type<unknown>} model The original model class to extend or modify.
   * @param {Type<unknown>[]} models A collection of existing models to reference or updates.
   * @param {any} target The target object to associate the modified model with.
   * @return {string} The name or identifier of the newly generated or modified model.
   */
  private generateExtraModel(options: ApiResponseOptions, key: string, model: Type<unknown>, models: Type<unknown>[], target: any): string {

    // convert factory to function or false
    const type = generateSchemaType(options);
    const factory: Function | false = this.options.responseOverrideModelNameFactory as any;

    // check if the type and factory are valid
    if(type && factory){

      // generate a new model name with factory
      const modelName = factory(model.name, type);

      // create a dynamic model from the original
      model = {
        [modelName]: class extends OmitType(model, [key] as any){},
      }[modelName];

      // add property with the right schema
      DECORATORS.SWAGGER.MODEL_PROPERTIES.set({ type } as any, model.prototype, key);
      DECORATORS.SWAGGER.MODEL_PROPERTIES_ARRAY.add(`:${key}`, model.prototype);

    }

    // add extra model
    return this.addExtraModel(model, models, target);

  }

  /**
   * Normalizes the input status into a standardized override response status.
   *
   * @param {string|number} status - The status to be normalized. It can be either a string or a number.
   * @return {IOpenApiDocumentOverrideResponseStatus} The normalized status, returned as an override response status.
   */
  private normalizeStatus(status: string|number): IOpenApiDocumentOverrideResponseStatus {
    const code = typeof status === 'number' ? status.toString() : status;
    if(code.match(/^[1-5]XX$/)){
      return code as IOpenApiDocumentOverrideResponseStatus;
    }
    if(code.match(/^[1-5][0-9][0-9]$/)){
      return parseInt(code) as IOpenApiDocumentOverrideResponseStatus;
    }
    return code as IOpenApiDocumentOverrideResponseStatus;
  }

}

function defaultResponseOverrideModelNameFactory(overrideName: string, typeName: string): string {
  return [overrideName, 'of', typeName].map(pascalCase).join('');
}