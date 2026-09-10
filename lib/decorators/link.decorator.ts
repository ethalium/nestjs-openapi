import { applyDecorators } from '@nestjs/common';
import { ApiLink, ApiLinkOptions } from '@nestjs/swagger';

export function OALink(options: ApiLinkOptions) : ClassDecorator & MethodDecorator {
  return applyDecorators(ApiLink(options));
}