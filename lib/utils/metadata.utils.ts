import { uniqBy } from 'lodash';

/**
 * Retrieves the metadata target based on the provided parameters.
 * If a propertyKey is provided, it adjusts the target accordingly.
 * If a descriptor is provided and it is an object containing a 'value' property,
 * it returns the value of the descriptor; otherwise, it returns the adjusted target.
 *
 * @param {any} target The initial target object or constructor.
 * @param {string|symbol} [propertyKey] The property key to adjust the target for (if applicable).
 * @param {PropertyDescriptor|number} [descriptor] The descriptor or number value related to the target,
 *                                                  used to determine what to return.
 *
 * @return {any} The resolved target, or the value from the descriptor if applicable.
 */
export function getMetadataTarget(target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor|number): any {
  target = propertyKey ? target : typeof target === 'function' ? target : target.constructor;
  return descriptor && typeof descriptor === 'object' && 'value' in descriptor ? descriptor.value : target;
}

/**
 * Retrieves and returns the appropriate metadata decoration arguments
 * based on the provided target, property key, and descriptor.
 *
 * @param {any} target - The target object on which metadata is being applied.
 * @param {string | symbol} [propertyKey] - The property key of the target, if applicable.
 * @param {PropertyDescriptor | number} [descriptor] - The property descriptor or a numeric index, if applicable.
 * @return {[any, (string | symbol | undefined)]} An array containing the modified target and optionally the property key.
 */
export function getMetadataDecorateArgs(target: any, propertyKey?: string|symbol, descriptor?: PropertyDescriptor|number): [target: any, propertyKey?: string|symbol] {
  if(descriptor && typeof descriptor === 'object'){
    return [getMetadataTarget(target, propertyKey, descriptor)];
  }
  return propertyKey ? [getMetadataTarget(target, propertyKey), propertyKey] : [getMetadataTarget(target, propertyKey)];
}

/**
 * Sets metadata for a specified target object or its property.
 *
 * @param {string} key - The key for the metadata entry.
 * @param {T} value - The value to associate with the metadata key.
 * @param {any} target - The target object on which the metadata is defined.
 * @param {string | symbol} [propertyKey] - The property key of the target object for which the metadata is defined. Optional.
 * @return {T} Returns the metadata value that was set.
 */
export function setMetadata<T = any>(key: string | symbol, value: T, target: any, propertyKey?: string | symbol): T {
  Reflect.defineMetadata(key, value, target, propertyKey as any);
  return value;
}

/**
 * Retrieves metadata associated with the specified key on the target object or optionally its property.
 *
 * @param {string} key - The metadata key to retrieve.
 * @param {any} target - The target object from which to retrieve the metadata.
 * @param {string | symbol} [propertyKey] - An optional property key of the target object to retrieve metadata for.
 * @return {T | null} The metadata value if found, otherwise null.
 */
export function getMetadata<T = any>(key: string | symbol, target: any, propertyKey?: string | symbol): T | null {
  // @ts-ignore
  return Reflect.getMetadata(key, target, propertyKey) || null;
}

/**
 * Sets metadata items for a given target and property key.
 *
 * @param {string} key - The metadata key used to store the data.
 * @param {T[]} items - An array of items to associate with the metadata key.
 * @param {any} target - The target object to associate the metadata items with.
 * @param {string | symbol} [propertyKey] - Optional property key of the target object to associate the metadata items with.
 * @return {T[]} The array of items that were set as metadata.
 */
export function setMetadataItems<T = any>(key: string | symbol, items: T[], target: any, propertyKey?: string | symbol): T[] {
  setMetadata(key, items, target, propertyKey);
  return items;
}

/**
 * Adds metadata items to the specified target and property key.
 *
 * @param {string} key - The metadata key under which the items are stored.
 * @param {T[]} items - The array of metadata items to be added.
 * @param {any} target - The target object to which the metadata applies.
 * @param {string | symbol} [propertyKey] - The optional property key for the metadata.
 * @return {T[]} The updated array of metadata items.
 */
export function addMetadataItems<T = any>(key: string | symbol, items: T[], target: any, propertyKey?: string | symbol): T[] {
  const current = getMetadataItems(key, target, propertyKey);
  return setMetadataItems(key, [ ...current, ...items ], target, propertyKey);
}

/**
 * Adds unique metadata items to a specified key on a target object and optionally a property key.
 * Ensures no duplicate items exist in the metadata array for the given key.
 *
 * @param {string} key - The metadata key under which the items will be stored.
 * @param {T[]} items - The array of items to add to the metadata.
 * @param {any} target - The target object where the metadata is stored.
 * @param {string | symbol} [propertyKey] - Optional property key of the target object where the metadata is associated.
 * @param {string} [uniqueKey] - Optional unique key to use for identifying duplicate items. Defaults to the item itself.
 * @return {T[]} - The updated list of unique metadata items under the specified key.
 */
export function addMetadataUniqueItems<T = any>(key: string | symbol, items: T[], target: any, propertyKey?: string | symbol, uniqueKey?: string): T[] {
  const current = getMetadataItems(key, target, propertyKey);
  if(uniqueKey){
    items = [ ...current, ...items ].reverse();
    items = uniqBy(items, uniqueKey);
  }
  return setMetadataItems(key, Array.from(new Set([ ...current, ...items ])), target, propertyKey);
}

/**
 * Retrieves metadata items associated with the specified key, target, and optionally, the propertyKey.
 * If no metadata items are found or the retrieved metadata is not an array, it returns an empty array.
 *
 * @param {string} key - The metadata key used to retrieve the associated metadata.
 * @param {any} target - The target object from which to retrieve the metadata.
 * @param {string | symbol} [propertyKey] - An optional property key to retrieve metadata for a specific property.
 * @return {T[]} An array of metadata items associated with the specified key, target, and propertyKey.
 */
export function getMetadataItems<T = any>(key: string | symbol, target: any, propertyKey?: string | symbol): T[] {
  const value = getMetadata(key, target, propertyKey);
  return Array.isArray(value) ? value : [];
}

/**
 * The `MetadataAccessor` class provides an abstraction for managing metadata
 * associated with a target object or its properties, using a specific key.
 *
 * This class allows setting and retrieving metadata for objects in a type-safe
 * manner, offering support for keyed metadata.
 *
 * @template T The type of metadata value to be handled by this accessor.
 */
export function MetadataAccessor<T = any>(metadataKey?: string|symbol) {
  return new class MetadataAccessor {
    readonly key: string | symbol = metadataKey || Symbol();
    get(target: any, propertyKey?: string | symbol): T|null {
      return getMetadata(this.key, target, propertyKey) || null;
    }
    set(value: T, target: any, propertyKey?: string | symbol): T {
      return setMetadata(this.key, value, target, propertyKey);
    }
  }
}

/**
 * Creates and returns an instance of `MetadataMapAccessor`. This utility provides methods
 * to manage metadata by reading and writing metadata values for a specific key on target objects
 * and their properties.
 *
 * @param metadataKey Optional metadata key (string or symbol) to identify the metadata.
 * If not provided, a unique symbol will be used as the key.
 * @return An instance of the `MetadataMapAccessor` class with the following methods:
 * - `getAll(target, propertyKey)`: Retrieves all metadata for a given target and optional property key.
 * - `setAll(value, target, propertyKey)`: Sets metadata value for a target and optional property key.
 * - `get(name, target, propertyKey)`: Retrieves a specific metadata value identified by `name`, for a given target and optional property key.
 * - `set(name, value, target, propertyKey)`: Sets a specific metadata value for a given `name`, target, and optional property key.
 */
export function MetadataMapAccessor<T = any, K extends keyof T = keyof T>(metadataKey?: string|symbol) {
  return new class MetadataMapAccessor {
    readonly key: string|symbol = metadataKey || Symbol();
    getAll(target: any, propertyKey?: string | symbol): T|null {
      return getMetadata(this.key, target, propertyKey) || null;
    }
    setAll(value: any, target: any, propertyKey?: string | symbol): T {
      return setMetadata(this.key, value, target, propertyKey);
    }

    get(name: K, target: any, propertyKey?: string | symbol): T[K]|null {
      const obj: any = this.getAll(target, propertyKey) || {};
      return obj[name] || null;
    }

    set(name: K, value: T[K], target: any, propertyKey?: string | symbol): T[K] {
      const obj: any = this.getAll(target, propertyKey) || {};
      obj[name] = value;
      this.setAll(obj, target, propertyKey);
      return value;
    }
  };
}

/**
 * A utility class for managing metadata as lists for given targets and properties.
 * This class provides methods to get, set, and add metadata entries.
 * Metadata is associated with a unique key, which is specified during instantiation.
 *
 * @template T The type of the items managed by this accessor.
 */
export function MetadataListAccessor<T = any>(metadataKey?: string|symbol, uniqueKey?: keyof T) {
  return new class MetadataListAccessor {
    readonly key: string|symbol = metadataKey || Symbol();
    get(target: any, propertyKey?: string | symbol): T[] {
      return getMetadataItems(this.key, target, propertyKey);
    }
    set(items: T, target: any, propertyKey?: string | symbol): T;
    set(items: T[], target: any, propertyKey?: string | symbol): T[];
    set(items: T|T[], target: any, propertyKey?: string | symbol): any {
      setMetadataItems(this.key, Array.isArray(items) ? items : [items], target, propertyKey);
      return items;
    }
    add(items: T, target: any, propertyKey?: string | symbol): T;
    add(items: T[], target: any, propertyKey?: string | symbol): T[];
    add(items: T|T[], target: any, propertyKey?: string | symbol): any {
      addMetadataUniqueItems(this.key, Array.isArray(items) ? items : [items], target, propertyKey, uniqueKey as string);
      return items;
    }
  };
}