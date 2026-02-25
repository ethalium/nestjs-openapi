import {DocumentBuilder} from "@nestjs/swagger";
import {
  ExtensionLocation,
  ParameterObject,
  SecuritySchemeObject,
  ServerVariableObject
} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import {ApiResponseOptions} from "@nestjs/swagger/dist/decorators/api-response.decorator";
import {OpenApiDocument} from "../interfaces/document.interface";

export interface IOpenApiDocumentBuilder {
  openApiVersion?: string;
  title?: string;
  description?: string;
  version?: string;
  termsOfService?: string;
  basePath?: string;
  contact?: IOpenApiDocumentBuilderContact;
  license?: IOpenApiDocumentBuilderLicense;
  servers?: IOpenApiDocumentBuilderServer[];
  externalDoc?: IOpenApiDocumentBuilderExternalDoc;
  extensions?: IOpenApiDocumentBuilderExtension[];
  securities?: IOpenApiDocumentBuilderSecurity[];
  globalResponses?: ApiResponseOptions[];
  globalParameters?: Array<Omit<ParameterObject, 'example' | 'examples'>>;
  auth?: IOpenApiDocumentBuilderAuth;
}
export interface IOpenApiDocumentBuilderContact {
  name: string;
  url: string;
  email: string;
}
export interface IOpenApiDocumentBuilderLicense {
  name: string;
  url: string;
}
export interface IOpenApiDocumentBuilderServer {
  url: string;
  description?: string;
  variables?: Record<string, ServerVariableObject>;
  serverExtraProperties?: Record<string, any>;
}
export interface IOpenApiDocumentBuilderExternalDoc {
  url: string;
  description: string;
}
export interface IOpenApiDocumentBuilderExtension<T = any> {
  key: string;
  properties: T;
  location?: ExtensionLocation;
}
export interface IOpenApiDocumentBuilderSecurity {
  name: string;
  options: SecuritySchemeObject;
  requirements?: string[];
}
export interface IOpenApiDocumentBuilderAuth {
  basic?: true|IOpenApiDocumentBuilderAuthSimple|IOpenApiDocumentBuilderAuthSimple[];
  bearer?: true|IOpenApiDocumentBuilderAuthSimple|IOpenApiDocumentBuilderAuthSimple[];
  oauth2?: true|IOpenApiDocumentBuilderAuthSimple|IOpenApiDocumentBuilderAuthSimple[];
  apiKey?: true|IOpenApiDocumentBuilderAuthSimple|IOpenApiDocumentBuilderAuthSimple[];
  cookie?: true|IOpenApiDocumentBuilderAuthCookie|IOpenApiDocumentBuilderAuthCookie[];
}
export interface IOpenApiDocumentBuilderAuthSimple {
  name?: string;
  options?: SecuritySchemeObject;
}
export interface IOpenApiDocumentBuilderAuthCookie {
  cookieName?: string;
  options?: SecuritySchemeObject;
  securityName?: string;
}

export class OpenApiDocumentBuilder extends DocumentBuilder {

  constructor(options?: IOpenApiDocumentBuilder) {
    super();
    options?.openApiVersion && this.setOpenAPIVersion(options.openApiVersion);
    options?.title && this.setTitle(options.title);
    options?.description && this.setDescription(options.description);
    options?.version && this.setVersion(options.version);
    options?.termsOfService && this.setTermsOfService(options.termsOfService);
    options?.basePath && this.setBasePath(options.basePath);
    options?.contact && this.setContact(options.contact.name, options.contact.url, options.contact.email);
    options?.license && this.setLicense(options.license.name, options.license.url);
    options?.servers && options.servers.map(server => this.addServer(server.url, server.description, server.variables, server.serverExtraProperties));
    options?.externalDoc && this.setExternalDoc(options?.externalDoc.description, options.externalDoc.url);
    options?.extensions && options.extensions.map(extension => this.addExtension(extension.key, extension.properties, extension.location));
    options?.securities && options.securities.map(security => {
      this.addSecurity(security.name, security.options);
      security.requirements && this.addSecurityRequirements(security.name, security.requirements);
    });
    options?.globalResponses && this.addGlobalResponse(...options.globalResponses);
    options?.globalParameters && this.addGlobalParameters(...options.globalParameters);
    options?.auth?.basic && (Array.isArray(options.auth.basic) ? options.auth.basic : [options.auth.basic === true ? {} : options.auth.basic]).map(auth => this.addBasicAuth(auth.options, auth.name));
    options?.auth?.bearer && (Array.isArray(options.auth.bearer) ? options.auth.bearer : [options.auth.bearer === true ? {} : options.auth.bearer]).map(auth => this.addBearerAuth(auth.options, auth.name));
    options?.auth?.oauth2 && (Array.isArray(options.auth.oauth2) ? options.auth.oauth2 : [options.auth.oauth2 === true ? {} : options.auth.oauth2]).map(auth => this.addOAuth2(auth.options, auth.name));
    options?.auth?.apiKey && (Array.isArray(options.auth.apiKey) ? options.auth.apiKey : [options.auth.apiKey === true ? {} : options.auth.apiKey]).map(auth => this.addApiKey(auth.options, auth.name));
    options?.auth?.cookie && (Array.isArray(options.auth.cookie) ? options.auth.cookie : [options.auth.cookie === true ? {} : options.auth.cookie]).map(auth => this.addCookieAuth(auth.cookieName, auth.options, auth.securityName));
  }

  /**
   * Retrieves the OpenAPI document object, omitting the 'paths' property.
   *
   * @return {Omit<OpenApiDocument, 'paths'>} The OpenAPI document without the 'paths' property.
   */
  protected get documentObject(): Omit<OpenApiDocument, 'paths'> {
    return (this as any).document;
  }

}