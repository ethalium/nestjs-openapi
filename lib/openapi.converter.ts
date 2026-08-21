import { OpenAPIObject } from '@nestjs/swagger';
import { IOpenApiDocumentOptions } from './interfaces/document.interface';
import { convertOpenApi30To31 } from './converters/convert-30-to-31';
import { convertOpenApi31To32 } from './converters/convert-31-to-32';
import { isOpenApiVersion } from './utils/version.utils';

export class OpenApiConverter {
  convert(target: NonNullable<IOpenApiDocumentOptions['convertTo']>, document: OpenAPIObject): OpenAPIObject {

    // skip if no version is defined
    if(!document.openapi){
      return document;
    }

    // skip if target version is same as document version
    if(isOpenApiVersion(target, document)){
      return document;
    }

    // convert document
    switch(target) {
      case '3.1.0': {
        document = convertOpenApi30To31(document);
        break;
      }
      case '3.2.0': {
        if(!isOpenApiVersion('3.1.0', document)){
          document = this.convert('3.1.0', document);
        }
        document = convertOpenApi31To32(document);
        break;
      }
    }

    // return converted document
    return document;

  }
}