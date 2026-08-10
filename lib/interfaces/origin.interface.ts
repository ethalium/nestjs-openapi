import { DecoratorContext } from '../utils/decorator.utils';

export interface IOpenApiOriginMetadata extends Omit<DecoratorContext, 'data'> {
  id: number;
}