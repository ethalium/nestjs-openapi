import { applyDecorators } from '@nestjs/common';
import { ApiWebhook } from '@nestjs/swagger';

export function OAWebhook(name?: string): MethodDecorator {
  return applyDecorators(ApiWebhook(name));
}