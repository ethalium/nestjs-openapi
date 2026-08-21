import type { IOpenApiTypeRef } from '../../interfaces/common.interface';
import { extractString } from '../../utils/type.utils';
import { OACreateProperty } from '../property.decorator';
import type { SchemaObject } from '@nestjs/swagger';

export function OATypeProperty(typeRef: IOpenApiTypeRef, schema?: Omit<SchemaObject, 'type'|'$ref'>) : PropertyDecorator;
export function OATypeProperty(typeRef: IOpenApiTypeRef, description?: string, schema?: Omit<SchemaObject, 'type'|'$ref'|'description'>) : PropertyDecorator;
export function OATypeProperty(typeRef: IOpenApiTypeRef, ...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: typeRef as any,
      description: extractString(args) || undefined,
    },
  });
}

export function OATypePropertyOptional(typeRef: IOpenApiTypeRef, schema?: Omit<SchemaObject, 'type'|'$ref'|'required'>) : PropertyDecorator;
export function OATypePropertyOptional(typeRef: IOpenApiTypeRef, description?: string, schema?: Omit<SchemaObject, 'type'|'$ref'|'description'|'required'>) : PropertyDecorator;
export function OATypePropertyOptional(typeRef: IOpenApiTypeRef, ...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: typeRef as any,
      description: extractString(args) || undefined,
      required: false,
    },
  });
}