import {SchemaObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import {extractObject, extractString} from "../../utils/type.utils";
import {IOpenApiPropertyOptions} from "../../interfaces/property.interface";
import {OACreateProperty} from "../property.decorator";

export function OAObjectProperty(schema?: SchemaObject) : PropertyDecorator;
export function OAObjectProperty(description?: string, schema?: SchemaObject) : PropertyDecorator;
export function OAObjectProperty(...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: 'object',
      description: extractString(args) || undefined,
      properties: extractObject(args) || {},
    }
  });
}

export function OAObjectPropertyOptional(options?: Omit<IOpenApiPropertyOptions, 'type'|'required'>) : PropertyDecorator;
export function OAObjectPropertyOptional(description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'required'|'description'>) : PropertyDecorator;
export function OAObjectPropertyOptional(...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: 'object',
      description: extractString(args) || undefined,
      properties: extractObject(args) || {},
      selfRequired: false,
    }
  });
}