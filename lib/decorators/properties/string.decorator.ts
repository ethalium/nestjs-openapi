import {IOpenApiPropertyOptions} from "../../interfaces/property.interface";
import {OACreateProperty} from "../property.decorator";

export function OAStringProperty(options?: Omit<IOpenApiPropertyOptions, 'type'>) : PropertyDecorator;
export function OAStringProperty(description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'description'>) : PropertyDecorator;
export function OAStringProperty(...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: 'string',
    }
  });
}

export function OAStringPropertyOptional(options?: Omit<IOpenApiPropertyOptions, 'type'|'required'>) : PropertyDecorator;
export function OAStringPropertyOptional(description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'required'|'description'>) : PropertyDecorator;
export function OAStringPropertyOptional(...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: 'string',
      required: false,
    }
  });
}