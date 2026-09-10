import { applyDecorators } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';

export function OAConsumes(...mimeTypes: string[]) : ClassDecorator & MethodDecorator {
  return applyDecorators(ApiConsumes(...mimeTypes));
}