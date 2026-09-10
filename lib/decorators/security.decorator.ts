import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOAuth2,
  ApiSecurity,
  SecurityRequirementObject,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function OASecurity(name: string | SecurityRequirementObject, requirements?: string[]): ClassDecorator & MethodDecorator {
  return applyDecorators(ApiSecurity(name, requirements));
}

export function OABasicAuth(name?: string): ClassDecorator & MethodDecorator {
  return applyDecorators(ApiBasicAuth(name));
}

export function OABearerAuth(name?: string): ClassDecorator & MethodDecorator {
  return applyDecorators(ApiBearerAuth(name));
}

export function OACookieAuth(name?: string): ClassDecorator & MethodDecorator {
  return applyDecorators(ApiCookieAuth(name));
}

export function OAOAuth2(scopes: string[], name?: string): ClassDecorator & MethodDecorator {
  return applyDecorators(ApiOAuth2(scopes, name));
}