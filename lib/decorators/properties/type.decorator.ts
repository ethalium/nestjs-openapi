import {IOpenApiTypeRef} from "../../interfaces/common.interface";
import {SchemaObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import {extractString, resolveClassRef} from "../../utils/type.utils";
import {OACreateProperty} from "../property.decorator";

export function OATypeProperty(typeRef: IOpenApiTypeRef, schema?: Omit<SchemaObject, 'type'|'$ref'>) : PropertyDecorator;
export function OATypeProperty(typeRef: IOpenApiTypeRef, description?: string, schema?: Omit<SchemaObject, 'type'|'$ref'|'description'>) : PropertyDecorator;
export function OATypeProperty(typeRef: IOpenApiTypeRef, ...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: resolveClassRef(typeRef) as any,
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
      type: resolveClassRef(typeRef) as any,
      description: extractString(args) || undefined,
      required: false,
    },
  });
}