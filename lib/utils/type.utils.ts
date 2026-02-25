import {Type} from "@nestjs/common";
import {
  IOpenApiRouteLike,
  IOpenApiType,
  IOpenApiTypeRef,
  IOpenApiTypeRefList,
  IOpenApiTypeRefSingle
} from "../interfaces/common.interface";
import {isFunction} from "lodash";

/**
 * Checks if the provided value is null or undefined.
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is null or undefined, otherwise false.
 */
export function isNil(value: any): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Determines whether the provided value is of a primitive data type.
 * This function performs a check against common JavaScript constructors.
 *
 * @param value The value to be checked against primitive types.
 * @return A boolean indicating whether the value is a primitive type.
 */
export function isPrimitive(value: any): value is String | Number | Boolean | Array<any> | Object | Date {
  return [String, Number, Boolean, Array, Object, Date].includes(value);
}

/**
 * Checks if a given value is a plain object (an object created by the Object constructor or with `Object.create(null)`).
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns `true` if the value is a plain object, otherwise `false`.
 */
export function isPlainObject(value: any): value is Object {
  return typeof value === 'object' && !isNil(value) && value.constructor && value.constructor === Object;
}

/**
 * Determines if the provided value is a class reference.
 *
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a class reference.
 */
export function isClassRef<T = unknown>(value: any): value is Type<T> {
  return typeof value === 'function' && !isPrimitive(value) && /^\s*class\s+/.test(value.toString());
}

/**
 * Determines if the provided value is of a valid type (`IOpenApiType`) by checking
 * if it is a class reference, a function, an array, or a string.
 *
 * @param {any} value - The value to check.
 * @return {value is IOpenApiType} Returns `true` if the value matches the type `IOpenApiType`, otherwise `false`.
 */
export function isType(value: any): value is IOpenApiType {
  return isClassRef(value) || isFunction(value) || Array.isArray(value) || typeof value === 'string';
}

/**
 * Checks if the given value is a type reference of `IOpenApiTypeRef<T>`.
 *
 * @param value - The value to be checked.
 * @return Returns `true` if the value is a type reference of `IOpenApiTypeRef<T>`, otherwise `false`.
 */
export function isTypeRef<T = unknown>(value: any): value is IOpenApiTypeRef<T> {
  return !!resolveClassRef(value);
}

/**
 * Extracts a specific type from an array of arguments starting from a given index.
 * Should not be used when multiple strings are present in the args and the type is not "first".
 *
 * @param {any[]} args - The array of arguments to extract the type from.
 * @param {number} [startIndex] - The optional index to start the extraction from. Defaults to 0 if not provided.
 * @param {number} [endIndex] - The ending index (exclusive) for the range to keep. If undefined, all elements after startIndex are included.
 * @return {IOpenApiType | null} - Returns the first instance of `IOpenApiType` found in the arguments, or `null` if none is found.
 */
export function extractType(args: any[], startIndex?: number, endIndex?: number): IOpenApiType | null {
  return reduceArgs(args, startIndex, endIndex).find(arg => isType(arg)) as IOpenApiType || null;
}

/**
 * Extracts a type reference from the provided arguments, starting at a specified index.
 *
 * @param {any[]} args - The array of arguments to extract the type from.
 * @param {number} [startIndex] - The optional index to start the extraction from. Defaults to 0 if not provided.
 * @param {number} [endIndex] - The ending index (exclusive) for the range to keep. If undefined, all elements after startIndex are included.
 * @return {IOpenApiTypeRef<T>} The extracted type reference if found, or `null` if not.
 */
export function extractTypeRef<T = unknown>(args: any[], startIndex?: number, endIndex?: number): IOpenApiTypeRef<T> | null {
  return reduceArgs(args, startIndex, endIndex).find(arg => isTypeRef(arg)) as Type<T> || null;
}

/**
 * Extracts a route from the provided arguments array, beginning from a specified index.
 * The route is determined based on whether the argument is either a non-nil array or a string.
 *
 * @param {any[]} args - The array of arguments to extract the type from.
 * @param {number} [startIndex] - The optional index to start the extraction from. Defaults to 0 if not provided.
 * @param {number} [endIndex] - The ending index (exclusive) for the range to keep. If undefined, all elements after startIndex are included.
 * @return {IOpenApiRouteLike | null} Returns the extracted route if found, or null if no valid route is identified.
 */
export function extractRoute(args: any[], startIndex?: number, endIndex?: number): IOpenApiRouteLike | null {
  return reduceArgs(args, startIndex, endIndex).find(arg => !isNil(arg) && (Array.isArray(arg) || typeof arg === 'string')) || null;
}

/**
 * Extracts the first string from an array of arguments, starting from a specified index.
 *
 * @param {any[]} args - The array of arguments to extract the type from.
 * @param {number} [startIndex] - The optional index to start the extraction from. Defaults to 0 if not provided.
 * @param {number} [endIndex] - The ending index (exclusive) for the range to keep. If undefined, all elements after startIndex are included.
 * @return {string|null} The first string found in the array starting from the specified index, or null if none is found.
 */
export function extractString(args: any[], startIndex?: number, endIndex?: number): string | null {
  return reduceArgs(args, startIndex, endIndex).find(arg => typeof arg === 'string') || null;
}

/**
 * Extracts the first argument that is a number or bigint from a given array.
 *
 * @param {any[]} args - An array of arguments to search through.
 * @param {number} [startIndex] - The optional starting index from where the search begins. Defaults to the beginning of the array if not specified.
 * @param {number} [endIndex] - The optional ending index where the search ends. Defaults to the end of the array if not specified.
 * @return {string | null} The first number or bigint found in the specified portion of the array, or null if no numbers or bigints are found.
 */
export function extractNumber(args: any[], startIndex?: number, endIndex?: number): number | null {
  return reduceArgs(args, startIndex, endIndex).find(arg => typeof arg === 'number') || null;
}

/**
 * Extracts the first plain object from an array of arguments starting from a given index.
 *
 * @param {any[]} args - The array of arguments to extract the type from.
 * @param {number} [startIndex] - The optional index to start the extraction from. Defaults to 0 if not provided.
 * @param {number} [endIndex] - The ending index (exclusive) for the range to keep. If undefined, all elements after startIndex are included.
 * @return {T | null} - The first plain object found in the array or null if none exist.
 */
export function extractObject<T = any>(args: any[], startIndex?: number, endIndex?: number): T | null {
  return reduceArgs(args, startIndex, endIndex).find(arg => isPlainObject(arg)) || null;
}

/**
 * Extracts and checks for the presence of a `false` value within the given array of arguments.
 *
 * @param {any[]} args - The array of arguments to extract the type from.
 * @param {number} [startIndex] - The optional index to start the extraction from. Defaults to 0 if not provided.
 * @param {number} [endIndex] - The ending index (exclusive) for the range to keep. If undefined, all elements after startIndex are included.
 * @return {boolean} Returns `true` if a `false` value is present in the array after the optional start index, otherwise `false`.
 */
export function extractFalse(args: any[], startIndex?: number, endIndex?: number): boolean {
  return reduceArgs(args, startIndex, endIndex).includes(false);
}

/**
 * Filters and reduces the given array of arguments based on specified start and end indices.
 *
 * @param {any[]} args - The array of arguments to reduce.
 * @param {number} [startIndex] - The optional start index (inclusive) from which to begin filtering.
 * @param {number} [endIndex] - The optional end index (exclusive) up to which to filter.
 * @return {any[]} A new array containing elements from the original array within the specified range.
 */
export function reduceArgs(args: any[], startIndex?: number, endIndex?: number): any[] {
  return args.filter((_, i) => (startIndex === undefined || i >= startIndex) && (endIndex === undefined || i < endIndex));
}

/**
 * Extracts and resolves the type reference from the provided arguments.
 *
 * @param {any[]} args - An array of arguments to extract the type reference from.
 * @param {number} [startIndex] - Optional starting index in the arguments array to search for the type reference.
 * @param {number} [endIndex] - Optional ending index in the arguments array to stop searching for the type reference.
 * @return {Type<T>|Type<T>[]|null} The resolved type reference(s) if found, otherwise returns null.
 */
export function extractAndResolveClassRef<T = unknown>(args: any[], startIndex?: number, endIndex?: number): Type<T>|Type<T>[] | null {
  const typeRef = extractTypeRef<T>(args, startIndex, endIndex);
  return typeRef ? resolveClassRef<T>(typeRef) : null;
}

/**
 * Resolves a class reference provided as an OpenAPI type reference.
 */
export function resolveClassRef<T = unknown>(value: IOpenApiTypeRefSingle<T>): Type<T>|null;
export function resolveClassRef<T = unknown>(value: IOpenApiTypeRefList<T>): Type<T>[]|null;
export function resolveClassRef<T = unknown>(value: IOpenApiTypeRef<T>): Type<T>|Type<T>[]|null;
export function resolveClassRef<T = unknown>(value: IOpenApiTypeRef<T>): Type<T>|Type<T>[]|null {

  // resolve list of classRef if its an array
  if(Array.isArray(value)) {
    const refs = value.map(ref => resolveClassRef(ref)).filter(ref => !!ref);
    return refs.length ? refs : null;
  }

  // resolve single classRef
  if(isClassRef(value)) {
    return value;
  }

  // resolve classRef if its a forwardRef
  if(!isNil(value) && !isClassRef(value) && typeof value === 'function'){
    return resolveClassRef(value() as any);
  }

  // return null if not a classRef
  return null;

}