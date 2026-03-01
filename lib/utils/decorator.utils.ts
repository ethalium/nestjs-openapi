import 'reflect-metadata';
import {applyDecorators, SetMetadata, Type} from '@nestjs/common';
import {addMetadataItems, addMetadataUniqueItems, getMetadataDecorateArgs, setMetadata} from "./metadata.utils";

/**
 * A type alias `AnyDecorator` that represents a union of various decorator types:
 * ClassDecorator, MethodDecorator, PropertyDecorator, and ParameterDecorator.
 *
 * A decorator is a special kind of declaration in JavaScript and TypeScript
 * that can be applied to various types of targets (classes, methods, properties, or parameters).
 *
 * This type is used to define a common interface or type that can be applied
 * to any of the supported decorator kinds.
 */
export type AnyDecorator =
  | ClassDecorator
  | MethodDecorator
  | PropertyDecorator
  | ParameterDecorator;

/**
 * A utility type that represents a decorator capable of being applied to multiple targets,
 * including classes, methods, properties, and parameters.
 *
 * This type is a composition of the following decorator types:
 * - ClassDecorator: Allows the decorator to be used on a class.
 * - MethodDecorator: Allows the decorator to be used on a method.
 * - PropertyDecorator: Allows the decorator to be used on a property.
 * - ParameterDecorator: Allows the decorator to be used on a method parameter.
 */
export type AllDecorator =
  & ClassDecorator
  & MethodDecorator
  & PropertyDecorator
  & ParameterDecorator;

/**
 * Represents the types of targets that metadata can be applied to within a programming context.
 *
 * This type is used to indicate the nature of the target for which a metadata item is associated.
 * The possible values correspond to distinct structural elements in a program.
 *
 * Possible values:
 * - 'class': Represents a class definition or object type.
 * - 'method': Represents a method or function within a class or object.
 * - 'property': Represents a property or field within a class or object.
 * - 'parameter': Represents a parameter of a method or function.
 */
export type DecoratorKind = 'class' | 'method' | 'property' | 'parameter';

/**
 * Defines a factory type for creating decorators. A `DecoratorFactory` is a
 * function that takes an input of type `TInput` and returns a decorator
 * of type `TDecorator`.
 *
 * @template TInput - The type of the input parameter to the factory function.
 *                     Defaults to `void` if no input is required.
 * @template TDecorator - The type of the decorator returned by the factory function.
 *                         This is typically a function or an object with specific
 *                         behavioral properties.
 */
export type DecoratorFactory<TInput = void, TDecorator = AnyDecorator> = (input: TInput) => TDecorator;

/**
 * Represents the context in which a decorator is executed. It provides metadata
 * and access to the target being decorated and additional details specific to
 * the type of decorator.
 *
 * @interface DecoratorContext
 * @property kind Specifies the kind of decorator being invoked. It helps to
 *                determine the nature of the decorated element, such as a class,
 *                property, method, or parameter.
 * @property target Refers to the target being decorated. This could be a class
 *                  constructor or the prototype object if a method or property
 *                  is being decorated.
 * @property propertyKey An optional property or method name being decorated. Can
 *                       be a string or symbol. Undefined for class and parameter
 *                       decorators.
 * @property propertyDescriptor An optional property descriptor when decorating a method
 *                      or property. Undefined in the case of class and parameter
 *                      decorators.
 * @property parameterIndex The index of the parameter being decorated within a
 *                          method's parameter list. Only available for parameter
 *                          decorators.
 * @property ctor The constructor function for the class containing the decorated
 *                element. Useful to access the enclosing class during decoration.
 * @property prototype The prototype of the class, providing access to all shared
 *                     methods and properties during decoration.
 */
export interface DecoratorContext<TInput = void> {
  kind: DecoratorKind;
  target: any;
  decorateArgs: [targetOrDescriptorValue?: any, propertyKey?: string|symbol];
  propertyKey?: string | symbol;
  propertyDescriptor?: PropertyDescriptor;
  parameterIndex?: number;
  data: TInput;
}

/**
 * Represents configuration options for applying decorators.
 *
 * This interface defines the structure of options that can be used
 * to customize the behavior of decorators, including transformation
 * functions, decorator retrieval, metadata generation, and custom behavior
 * during application.
 *
 * @template TInput The type of input values in the list.
 * @template TTransformed The type of transformed values in the list. Defaults to `TInput`.
 *
 * @property transform An optional function to transform the input value into a desired output format.
 * @property decorators An optional function that applies additional decorators to the transformed value.
 * @property metadata An optional function that generates metadata for the transformed value.
 * @property onApply An optional callback invoked when the decorator is applied, allowing custom operations.
 */
export interface DecoratorOptions<TInput = void, TTransformed = TInput> {
  transform?: (ctx: DecoratorContext<TInput>) => TTransformed;
  decorators?: (ctx: DecoratorContext<TTransformed>, store: AnyDecorator[]) => AnyDecorator[] | any;
  metadata?: (ctx: DecoratorContext<TTransformed>) => Array<{ key: string; value: any }> | undefined;
  onApply?: (ctx: DecoratorContext<TTransformed>) => void;
}

/**
 * Represents options for configuring a decorator that processes a list of items.
 *
 * @template TInput The type of input values in the list.
 * @template TTransformed The type of transformed values in the list. Defaults to `TInput`.
 *
 * @property metadataKey A unique key used for storing metadata associated with the decorator.
 * @property transform An optional function to transform the input value into a desired output format.
 * @property unique An optional flag indicating whether duplicate transformed values should be discarded.
 * @property decorators An optional function that applies additional decorators to the transformed value.
 * @property onApply An optional callback invoked when the decorator is applied, allowing custom operations.
 */
export interface ListDecoratorOptions<TInput, TTransformed = TInput> {
  metadataKey: string;
  transform?: (ctx: DecoratorContext<TTransformed[]>) => TTransformed[];
  unique?: boolean;
  decorators?: (ctx: DecoratorContext<TTransformed[]>, store: AnyDecorator[]) => AnyDecorator[];
  onApply?: (ctx: DecoratorContext<TTransformed[]>) => void;
}

/**
 * Determines the kind of metadata target based on the provided arguments.
 *
 * @param {any} target - The target to analyze, typically a class, method, property, or parameter.
 * @param {string|symbol} [propertyKey] - The optional property name or symbol associated with the target.
 * @param {PropertyDescriptor|number} [propertyDescriptor] - The optional property descriptor or parameter index.
 * @return {DecoratorKind} The detected metadata target kind, which could be 'class', 'method', 'property', or 'parameter'.
 */
export function detectDecoratorKind(target: any, propertyKey?: string|symbol, propertyDescriptor?: PropertyDescriptor|number): DecoratorKind {
  // target => class
  if(target && propertyKey && propertyDescriptor){
    return 'class';
  }

  // target => parameter
  if(typeof propertyDescriptor === 'number'){
    return 'parameter';
  }

  // target => method
  if(propertyDescriptor && typeof propertyDescriptor === 'object'){
    return 'method';
  }

  // target => property
  return 'property';
}

/**
 * Builds and returns a context object representing metadata about a decorator's application.
 *
 * @param {any[]} args - An array containing arguments provided by the decorator's invocation.
 *                                It typically includes the target object, property key, and an optional third argument that varies based on the kind of decorator (e.g., method descriptor or parameter index).
 * @param {any} data - The transformed input value provided by the decorator's transformation function.'
 * @return {DecoratorContext} An object containing the metadata for the decorator, including its kind, target, propertyKey, descriptor (if method), parameterIndex (if parameter), constructor, and prototype.
 */
export function buildDecoratorContext<TValue = any>(args: any[], data: TValue): DecoratorContext<TValue> {
  const [target, propertyKey, descriptor] = args;
  const kind = detectDecoratorKind(args);
  return {
    kind: kind,
    target: target,
    decorateArgs: getMetadataDecorateArgs(target, propertyKey, descriptor),
    propertyKey: propertyKey,
    propertyDescriptor: kind === 'method' ? (descriptor as PropertyDescriptor) : undefined,
    parameterIndex: kind === 'parameter' ? (descriptor as number) : undefined,
    data: data,
  }
}

/**
 * Creates a decorator factory that applies transformations and manages metadata.
 *
 * @param opts Options specifying how the decorator should behave, including
 *   transformation logic, custom decorators, metadata settings, and apply behavior.
 *   It includes:
 *     - `transform`: A function that transforms the input into the desired data.
 *     - `decorators`: A function providing custom decorators to be applied based on the context.
 *     - `metadata`: A function to build and set metadata on the target object.
 *     - `onApply`: A function executed during application of the decorator.
 *
 * @return A decorator factory function that takes an input and returns a decorator. This
 * function processes contextual data, sets up metadata as defined, and applies the configured
 * decorators when executed.
 */
export function createDecorator<TInput = void, TTransformed = TInput>(opts: DecoratorOptions<TInput, TTransformed>): DecoratorFactory<TInput> {
  return (input: TInput) => {
    return (...args: any[]) => {

      // create context from arguments
      const ctx = buildDecoratorContext<any>(args, input);

      // create data by calling transform function if provided
      ctx.data = opts.transform ? opts.transform(ctx) : (input as any as TTransformed);

      // compose decorators
      const decoratorStore: AnyDecorator[] = [];
      const decoratorFuncResult = opts.decorators?.(ctx, decoratorStore) ?? null;
      const decorators = Array.isArray(decoratorFuncResult) ? decoratorFuncResult : decoratorStore;

      // create metadata
      opts.metadata?.(ctx)?.map(meta => setMetadata(meta.key, meta.value, ctx.target, ctx.propertyKey));

      // invoke onApply
      opts.onApply?.(ctx);

      // apply decorators
      decorators.map(d => (d as any)(...args));
      return args[2];
    };
  };
}

/**
 * Creates a class decorator based on the provided options.
 *
 * @param {DecoratorOptions<TInput, TTransformed>} opts - The options used to configure and create the class decorator.
 * @return {DecoratorFactory<TInput, ClassDecorator>} A decorator factory that produces a class decorator.
 */
export function createClassDecorator<TInput = void, TTransformed = TInput>(opts: DecoratorOptions<TInput, TTransformed>): DecoratorFactory<TInput, ClassDecorator> {
  return createDecorator<TInput, TTransformed>(opts) as any;
}

/**
 * Creates a method decorator based on the provided options.
 *
 * @param {DecoratorOptions<TInput, TTransformed>} opts - The options used to configure and create the method decorator.
 * @return {DecoratorFactory<TInput, MethodDecorator>} A decorator factory that produces a method decorator.
 */
export function createMethodDecorator<TInput = void, TTransformed = TInput>(opts: DecoratorOptions<TInput, TTransformed>): DecoratorFactory<TInput, MethodDecorator> {
  return createDecorator<TInput, TTransformed>(opts) as any;
}

/**
 * Creates a property decorator based on the provided options.
 *
 * @param {DecoratorOptions<TInput, TTransformed>} opts - The options used to configure and create the property decorator.
 * @return {DecoratorFactory<TInput, PropertyDecorator>} A decorator factory that produces a property decorator.
 */
export function createPropertyDecorator<TInput = void, TTransformed = TInput>(opts: DecoratorOptions<TInput, TTransformed>): DecoratorFactory<TInput, PropertyDecorator> {
  return createDecorator<TInput, TTransformed>(opts) as any;
}

/**
 * Creates a parameter decorator based on the provided options.
 *
 * @param {DecoratorOptions<TInput, TTransformed>} opts - The options used to configure and create the parameter decorator.
 * @return {DecoratorFactory<TInput, ParameterDecorator>} A decorator factory that produces a parameter decorator.
 */
export function createParamDecorator<TInput = void, TTransformed = TInput>(opts: DecoratorOptions<TInput, TTransformed>): DecoratorFactory<TInput, ParameterDecorator> {
  return createDecorator<TInput, TTransformed>(opts) as any;
}

/**
 * List decorator factory:
 * - Appends a (transformed) value to a metadata list under `metadataKey`
 * - Optionally deduplicates
 * - Can still compose extra decorators and onApply hook
 *
 * Same "shape" as createDecorator: (input) => decorator
 */
export function createListDecorator<TInput, TTransformed = TInput>(opts: ListDecoratorOptions<TInput, TTransformed>) {
  return (input: TInput[]): AnyDecorator => {
    return (...args: any[]) => {

      // create context from arguments
      const ctx = buildDecoratorContext<any>(args, input);

      // create data by calling transform function if provided
      ctx.data = opts.transform ? opts.transform(ctx) : (input as any as TTransformed[]);

      // compose decorators
      const decoratorStore: AnyDecorator[] = [];
      const decoratorFuncResult = opts.decorators?.(ctx, decoratorStore) ?? null;
      const decorators = Array.isArray(decoratorFuncResult) ? decoratorFuncResult : decoratorStore;

      // add items to metadata
      if(opts.unique){
        addMetadataUniqueItems(opts.metadataKey, ctx.data, ...ctx.decorateArgs);
      }else{
        addMetadataItems(opts.metadataKey, ctx.data, ...ctx.decorateArgs);
      }

      // invoke onApply
      opts.onApply?.(ctx);

      // apply decorators
      decorators.map(d => (d as any)(...args));
      return args[2];
    }
  };
}