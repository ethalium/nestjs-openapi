import type { IOpenApiPropertyOptions } from '../../interfaces/property.interface';
import { OACreateProperty } from '../property.decorator';
import type { SchemaObject } from '@nestjs/swagger';

export function OAObjectProperty(schema?: Omit<SchemaObject, 'type'>) : PropertyDecorator;
export function OAObjectProperty(description?: string, schema?: Omit<SchemaObject, 'type'>) : PropertyDecorator;
export function OAObjectProperty(...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: 'object',
    } as any
  });
}

export function OAObjectPropertyOptional(options?: Omit<IOpenApiPropertyOptions, 'type'|'required'>) : PropertyDecorator;
export function OAObjectPropertyOptional(description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'required'|'description'>) : PropertyDecorator;
export function OAObjectPropertyOptional(...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: 'object',
      selfRequired: false,
    } as any
  });
}