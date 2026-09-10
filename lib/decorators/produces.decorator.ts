import { ApiProduces } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function OAProduces(...mimeTypes: string[]) : ClassDecorator & MethodDecorator {
  return applyDecorators(ApiProduces(...mimeTypes));
}