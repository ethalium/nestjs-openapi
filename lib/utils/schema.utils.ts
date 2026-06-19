import type { IOpenApiTypeRefSingle } from '../interfaces/common.interface';
import type { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { isClassRef, isPlainObject, isPrimitive, resolveClassRef } from './type.utils';
import type { Type } from '@nestjs/common';
import type { ApiResponseOptions } from '@nestjs/swagger';
import { getSchemaPath } from '@nestjs/swagger';

export function createSchemaRefs(refs: Array<IOpenApiTypeRefSingle|SchemaObject|ReferenceObject>, options?: {
  onClassRef?: (ref: Type) => void;
}): Array<SchemaObject|ReferenceObject> {
  return refs
    .map(ref => {

      // return schema object if its a plain object
      if(isPlainObject(ref)){
        return ref;
      }

      // return schema if primitive
      if(isPrimitive(ref)){
        return createSchemaFromPrimitive(ref);
      }

      // return classRef if it can be resolved.
      const classRef = resolveClassRef(ref);
      if(classRef){
        options?.onClassRef?.(classRef);
        return { $ref: getSchemaPath(classRef) };
      }

      // no compatible reference found
      return null;

    })
    .filter(_ => !!_) as any;
}

export function createSchemaFromPrimitive(item: any): SchemaObject|null {
  switch(true) {
    case item === String : return { type: 'string' };
    case item === Number : return { type: 'number' };
    case item === Boolean : return { type: 'boolean' };
    case item === Array : return { type: 'array' };
    case item === Object : return { type: 'object' };
    case item === Date : return { type: 'string', format: 'date-time' };
    default: return null;
  }
}

export function generateSchemaType(options: ApiResponseOptions): string|null {
  if(isPlainObject(options)){

    // extract data from options
    const { type, isArray, schema } = options as any;

    // return type 'array' if isArray is true
    if(type && isArray === true){
      return 'array';
    }

    // return 'object' if schema is classRef
    if(isClassRef(type)){
      return 'object';
    }

    // the return name of the function if the type is a function
    if(typeof type === 'function'){
      return type.name;
    }

    // return type if string
    if(typeof type === 'string'){
      return type;
    }

    // return type of schema if present
    if(isPlainObject(schema) && 'type' in schema && typeof schema.type === 'string'){
      return schema.type;
    }

  }
  return null;
}