<p align="center" style="font-size: 40px;">NestJS Swagger/OpenAPI - Extended Decorators</p>

<p align="center">Extended functionalities/decorators for the official <a href="https://github.com/nestjs/swagger">@nestjs/swagger</a> package</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@marxlnfcs/nest-swagger-decorators" target="_blank"><img src="https://img.shields.io/npm/v/@marxlnfcs/nest-swagger-decorators.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/package/@marxlnfcs/nest-swagger-decorators" target="_blank"><img src="https://img.shields.io/npm/l/@marxlnfcs/nest-swagger-decorators.svg" alt="Package License" /></a>
    <a href="https://www.npmjs.com/package/@marxlnfcs/nest-swagger-decorators" target="_blank"><img src="https://img.shields.io/npm/dm/@marxlnfcs/nest-swagger-decorators.svg" alt="NPM Downloads" /></a>
    <a href="https://www.npmjs.com/package/@marxlnfcs/nest-swagger-decorators" target="_blank"><img src="https://img.shields.io/bundlephobia/min/@marxlnfcs/nest-swagger-decorators?label=size" alt="Package Size" /></a>
</p>

## Installation
To begin using it, we first install the required dependencies:
```
npm install --save @ethalium/nestjs-openapi @nestjs/swagger
```

## Bootstrap
Once the installation is done, we need to initialize the OpenAPI wrapper using the `OpenApiModule`:

```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from "@nestjs/swagger";
import { OpenApiModule } from '@ethalium/nestjs-openapi';
import { AppModule } from './app.module';

async function bootstrap() {
  
  // create application
  const app = await NestFactory.create(AppModule);
  
  // create document builder
  const config = OpenApiModule.createDocumentBuilder({
    title: 'Cats example',
    description: 'The cats API description',
    version: '1.0',
  });
  
  // create document from builder
  const document = OpenApiModule.createDocument(app, config.build(), {
    ...
  });
  
  // setup swagger
  SwaggerModule.setup('api', app, document);
  
  // start server
  await app.listen(process.env.PORT ?? 3000);
  
}

bootstrap();

```

## Function: `OpenApi.createDocumentBuilder`
The DocumentBuilder class is used to configure the OpenAPI document. It extends the `DocumentBuilder` class from `@nestjs/swagger` package and gives you the ability to define the properties while constructing the class.

## Function: `OpenApi.createDocument`
The `createDocument` method is used to create the OpenAPI document. It runs the custom OpenAPI builder to build additional schema's like `TagGroups`, `TagNames`, `ResponseOverrides`, ect.

### Options

---
#### `uniqueTagGroupTags`: boolean
Indicates if the tags in a tagGroup should be unique for this group. 
* If set to `true`, all tags in a specific tagGroup will have the group name as a prefix and the original name will be set as 'x-displayName' to avoid duplicate tags in the generated OpenAPI document.
* If set to `false` or undefined, the tags will be added to the groups without transforming the name.

---
#### `uniqueTagGroupTagNameFactory`: (groupName: string, tagName: string) => string
A factory function that generates a custom model name for a tag in a tag group. It allows customization of naming conventions for tags programmatically. By default, the groupName and tagName will be joined together and put
through a `pascalCase` function.

---
#### `tagGroupUngrouped`: boolean|string|Omit<IOpenApiTagGroupMetadata, 'tags'>
Represents either a string or an object containing tag group metadata. If set to string or object, it will be used to define the default tag group for all endpoints that have no explicit tag group assigned. If true, it will add all ungrouped tags to the group "Ungrouped". If false or empty, endpoints that have no tag group will not be grouped.

---
#### `responseOverrides`: IOpenApiDocumentOverrideResponses
Represents optional response overrides that can be applied to refine or replace the OpenAPI response behavior for specific API request status codes.

```typescript
{
  responseOverrides: {

    // wrapps a response in the success response model. The original response will be stored under the 'data' key.
    '2XX': {
      type: HttpSuccessResponse,
      subKey: 'data'  
    },
    
    // overrides the default error response model (4XX and 5XX).
    'error': HttpErrorResponse,
      
  }
}
```

---
#### `responseOverrideModelNameFactory`: (overrideName: string, responseType: string) => string
A factory function that generates a custom model name for a response override. It allows customization of naming conventions for response overrides programmatically. Only applicable when using the `responseOverrides` option, for overrides that have a `subKey` defined, and if the `responseType` does either have a type or schema with `type` defined.


## Decorators
Decorators are used to add additional metadata to the controllers and endpoints. Some decorators are not documented here, because they're mainly used internally.

### `@OAController()` *Controller*
Invokes the `@Controller` decorator and adds the possibility to define OpenAPI metadata for the controller like `tags`, `tagGroups`, `headers`, `query parameters`, ect.

#### Schemas
* `@OAController(options?: OAControllerOptions)`
* `@OAController(path: string, options?: OAControllerOptions)`
* `@OAController(path: string, exclude?: false)`

#### Example
```typescript
@OAController('/', {...})
export class CatsController {
  
}
```

---
### `@OARoute` `@OAGet` `@OAPost` `@OAPut` `@OAPatch` `@OADelete` *Method*
Invokes the corresponding `@Get`, `@Post`, `@Put`, `@Patch`, `@Delete` decorators and adds the possibility to define OpenAPI metadata for the endpoint like `summary`, `description`, `parameters`, `responses`, ect.`

#### Schemas
* `@OAGet(options?: OARouteOptions)`
* `@OAGet(path: string, options?: OARouteOptions)`
* `@OAGet(path: string, exclude?: false)`
* ...

#### Example
```typescript
@OAController('/')
export class CatsController {
  
  @OAGet('/', {
    summary: 'Find all cats',
    description: 'Returns all cats from the database',
    response: [Cats]
  })
  findAll(): Cats[] {
    return this.catsService.findAll();
  }

}
```

---
### `@OAError` *Controller, Method*
Adds the `responses` metadata to the endpoint to define the OpenAPI response model for the specified error status code.

#### Schemas
* `@OABadRequest(options?: IOpenApiErrorOptions)`
* `@OABadRequest(description?: string, options?: IOpenApiErrorOptions)`
* `@OABadRequest(type: IOpenApiErrorType, description?: string, options?: IOpenApiErrorOptions)`

#### Example
```typescript
@OAController('/')
export class CatsController {

  @OAGet('/', {
    summary: 'Find all cats',
    description: 'Returns all cats from the database',
    response: [Cats]
  })
  @OAUnauthorized(HttpErrorResponse, "You're not authorized to access this resource.")
  findAll(): Cats[] {
    throw new BadRequestException('Invalid request');
  }

}
```

---
### `@OAProperty` *Property*
Adds properties to the OpenAPI schema for the specified class property. Invokes the `@ApiProperty` decorator from `@nestjs/swagger` package.
The library provides various decorators to add additional metadata to the OpenAPI schema. Every decorator looks like `@OA*Property` and `@OA*PropertyOptionsl`.

* `@OAStringProperty`, `@OAStringPropertyOptional`: Adds a string property to the OpenAPI schema.
* `@OANumberProperty`, `@OANumberPropertyOptional`: Adds a number property to the OpenAPI schema.
* `@OABooleanProperty`, `@OABooleanPropertyOptional`: Adds a boolean property to the OpenAPI schema.
* `@OATypeProperty`, `@OATypePropertyOptional`: Adds a nested classRef property to the OpenAPI schema.
* `@OAObjectProperty`, `@OAObjectPropertyOptional`: Adds an object property to the OpenAPI schema.
* `@OAEnumProperty`, `@OAEnumPropertyOptional`: Adds an enum property to the OpenAPI schema.
* `@OAAnyOfProperty`, `@OAAnyOfPropertyOptional`: Adds an anyOf property to the OpenAPI schema.`
* `@OAAllOfProperty`, `@OAAllOfPropertyOptional`: Adds an oneOf property to the OpenAPI schema.`
* `@OAOneOfProperty`, `@OAOneOfPropertyOptional`: Adds an oneOf property to the OpenAPI schema.`

---
### `@OATag`, `@OATags` *Controller*, *Method*
Adds the `tags` metadata to the endpoint to define the OpenAPI tag for the specified controller or method. Additional options like displayName and trait are available to set.

#### Example
```typescript
@OATag('Cats')
@OAController('/')
export class CatsController {
  
  @OATag('Find all cats')
  @OAGet('/', {
    summary: 'Find all cats',
    description: 'Returns all cats from the database',
    response: [Cats]
  })
  @OAUnauthorized(HttpErrorResponse, "You're not authorized to access this resource.")
  findAll(): Cats[] {
    throw new BadRequestException('Invalid request');
  }

}
```

### `@OATagGroup` *Module*, *Controller*, *Method*
Adds the `tagGroups` metadata to the controller or method to define the OpenAPI tag group for the specified controller or method.
* *Module*: Adds the tag group to the entire controllers in the module.
* *Controller*: Adds the tag group to the controller.
* *Method*: Adds the tag group to the method.

#### Example:
```typescript
@OATagGroup('Cats API')
@Module({...})
export class CatsModule {}
```