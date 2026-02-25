export type ClassEntry = ClassEntryMethod|ClassEntryProperty;

export interface ClassEntryMethod {
  kind: 'method';
  target: any;
  descriptor: PropertyDescriptor;
  propertyKey: string | symbol;
}

export interface ClassEntryProperty {
  kind: 'property'|'prototype-property';
  target: any;
  propertyKey: string | symbol;
}

/**
 * Retrieves all members of the given instance, including properties, methods, and accessors,
 * while also identifying inheritance and shadowing details.
 *
 * @param {any} instance - The instance whose members are to be retrieved.
 * @return {ClassEntry[]} An array of member details including information about properties,
 * methods, accessors, inheritance, shadowing, and declaring prototypes.
 */
export function getAllClassEntries(instance: any): ClassEntry[] {
  // return an empty array if the instance is not set
  if(!instance){
    return [];
  }

  // get ctor and root proto
  const ctor = instance.constructor;
  const rootProto = ctor?.prototype;

  // return an empty array if ctor or root proto is not set
  if(!ctor || !rootProto){
    return [];
  }

  // create array for entries
  const entries: ClassEntry[] = [];

  // used to mark shadowing
  const mostDerivedProtoKeys = new Set<string | symbol>([
    ...Object.getOwnPropertyNames(rootProto),
    ...Object.getOwnPropertySymbols(rootProto),
  ]);

  // instance own fields (these are "class properties" at runtime)
  for (const propertyKey of [Object.getOwnPropertyNames(instance), Object.getOwnPropertySymbols(instance)].flat(9)) {
    entries.push({
      kind: 'property',
      target: rootProto,
      propertyKey: propertyKey,
    });
  }

  // get class methods or other properties
  let proto: any = rootProto;
  while (proto && proto !== Object.prototype) {
    for (const propertyKey of [Object.getOwnPropertyNames(proto), Object.getOwnPropertySymbols(proto)].flat()) {
      // skip constructor and prototype properties
      if(propertyKey === 'constructor' || propertyKey === 'prototype'){
        continue;
      }

      // get a descriptor for a property
      const descriptor = Object.getOwnPropertyDescriptor(proto, propertyKey);

      // skip if descriptor is not set
      if (!descriptor) {
        continue;
      }

      // add entry to array
      if(typeof descriptor.value === 'function'){
        entries.push({
          kind: 'method',
          target: proto,
          propertyKey: propertyKey,
          descriptor: descriptor,
        });
      }else{
        entries.push({
          kind: 'property',
          target: proto,
          propertyKey: propertyKey,
        });
      }
    }
    proto = Object.getPrototypeOf(proto);
  }

  // return entries
  return entries;

}