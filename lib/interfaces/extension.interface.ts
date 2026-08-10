export type IOpenApiExtensionKey = `x-${string}`;

export interface IOpenApiExtensionMetadata<TProperties = any> {
  key: IOpenApiExtensionKey;
  properties?: TProperties;
}