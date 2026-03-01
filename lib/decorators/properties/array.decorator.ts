import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { extractObject, extractString } from '../../utils/type.utils';
import { IOpenApiPropertyOptions } from '../../interfaces/property.interface';
import { OACreateProperty } from '../property.decorator';

export function OAArrayProperty(schema?: SchemaObject) : PropertyDecorator;
export function OAArrayProperty(description?: string, schema?: SchemaObject) : PropertyDecorator;
export function OAArrayProperty(...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: 'array',
      description: extractString(args) || undefined,
      items: extractObject(args) || {},
      isArray: true,
    }
  });
}

export function OAArrayPropertyOptional(options?: Omit<IOpenApiPropertyOptions, 'type'|'required'>) : PropertyDecorator;
export function OAArrayPropertyOptional(description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'required'|'description'>) : PropertyDecorator;
export function OAArrayPropertyOptional(...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: 'array',
      description: extractString(args) || undefined,
      items: extractObject(args) || {},
      isArray: true,
      required: false,
    }
  });
}