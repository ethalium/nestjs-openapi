import type { ApiPropertyOptions } from '@nestjs/swagger';

export type IOpenApiPropertyOptions = ApiPropertyOptions & {

  /**
   * Specifies if the property should be exposed/hidden with @class-transformer.
   * @default true
   */
  expose?: boolean;

};