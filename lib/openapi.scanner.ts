import {INestApplication, Type} from "@nestjs/common";
import {NestContainer} from "@nestjs/core";
import {Module} from "@nestjs/core/injector/module";
import {ModulesContainer} from "@nestjs/core/injector/modules-container";
import {Controller} from "@nestjs/common/interfaces";
import {InstanceWrapper} from "@nestjs/core/injector/instance-wrapper";
import {isClassRef} from "./utils/type.utils";
import {ClassEntryMethod, ClassEntryProperty, getAllClassEntries} from "./utils/class.utils";

export interface IOpenApiScannedModule {
  id: string;
  name: string;
  parents: IOpenApiScannedModule[];
  item: Module;
  type: Type<Module>;
}

export interface IOpenApiScannedController {
  id: string;
  name: string;
  parents: IOpenApiScannedModule[];
  item: InstanceWrapper<Controller>;
  type: Type<Controller>;
  properties: ClassEntryProperty[];
  methods: ClassEntryMethod[];
}

export class OpenApiScanner {

  constructor(
    private readonly app: INestApplication,
  ){}

  /**
   * Retrieves the NestContainer instance from the application.
   *
   * @return {NestContainer} The container instance associated with the application.
   */
  private get container(): NestContainer {
    return (this.app as any).container;
  }

  /**
   * Retrieves a list of scanned modules.
   *
   * @param {boolean} [recursive=true] - Determines whether to include modules recursively.
   * @return {IOpenApiScannedModule[]} An array of scanned modules.
   */
  getModules(recursive: boolean = true): IOpenApiScannedModule[] {
    return this.resolveModules(this.container.getModules(), recursive);
  }

  /**
   * Resolves the module dependencies and returns a list of scanned modules.
   *
   * @param {ModulesContainer|Set<Module>} container - The container with the modules to resolve. It can either be a `ModulesContainer` or a `Set` of `Module` instances.
   * @param {boolean} [recursive=false] - A flag indicating whether to resolve dependencies recursively.
   * @param {IOpenApiScannedModule} [parent] - The parent module, if any, used to build the dependency tree.
   * @param {Map<string, IOpenApiScannedModule>} [scannedModules] - A map to store and track already scanned modules during the resolution process.
   * @return {IOpenApiScannedModule[]} An array of scanned module objects, each representing a module and its relationship within the dependency tree.
   */
  private resolveModules(container: ModulesContainer|Set<Module>, recursive: boolean = false, parent?: IOpenApiScannedModule, scannedModules?: Map<string, IOpenApiScannedModule>): IOpenApiScannedModule[] {

    // create a map for all modules
    const modules: Map<string, IOpenApiScannedModule> = scannedModules || new Map();

    // resolve next modules
    container.forEach((module: Module) => {
      if(!modules.has(module.id)){

        // create module object
        const item: IOpenApiScannedModule = {
          id: module.id,
          name: module.metatype.name,
          parents: (parent ? [parent.parents, parent] : []).flat(),
          item: module,
          type: module.metatype,
        };

        // add module to map
        modules.set(item.id, item);

        // resolve sub modules if recursive is true
        if(recursive){
          this.resolveModules(module.imports, recursive, item, modules);
        }

      }
    });

    // return modules
    return Array.from(modules.values());

  }

  /**
   * Retrieves the list of controllers.
   *
   * @param {boolean} [recursive=true] - Determines whether to perform a recursive search. Defaults to true.
   * @return {IOpenApiScannedController[]} An array of scanned controllers.
   */
  getControllers(recursive: boolean = true): IOpenApiScannedController[] {
    const modules = this.getModules(recursive);
    return this.resolveControllers(modules);
  }

  /**
   * Resolves and returns a list of scanned controllers by examining the provided modules.
   * It ensures all unique controllers are included, associating them with their respective module parents.
   *
   * @param {IOpenApiScannedModule[]} modules - An array of scanned modules from which controllers are resolved.
   * @param {Map<string, IOpenApiScannedModule>} [scannedControllers] - An optional map of already scanned controllers, allowing incremental updates.
   * @return {IOpenApiScannedModule[]} An array of resolved controllers, including associated parent modules.
   */
  private resolveControllers(modules: IOpenApiScannedModule[], scannedControllers?: Map<string, IOpenApiScannedController>): IOpenApiScannedController[] {

    // create a map for all controllers
    const controllers: Map<string, IOpenApiScannedController> = scannedControllers || new Map();

    // resolve controllers
    modules.map(module => {
      Array.from(module.item.controllers.values()).map(controller => {
        if(!controllers.has(controller.id) && isClassRef(controller.metatype)){
          controllers.set(controller.id, {
            id: controller.id,
            name: controller.metatype.name,
            parents: [module.parents, module].flat(),
            item: controller,
            type: controller.metatype as any,
            properties: getAllClassEntries(controller.instance).filter(item => item.kind === 'property') as any,
            methods: getAllClassEntries(controller.instance).filter(item => item.kind === 'method') as any,
          });
        }
      });
    });

    // return controllers
    return Array.from(controllers.values());

  }

}