import { DecoratorKind } from '../utils/decorator.utils';

export const EXTENSIONS = {
  ORIGIN: 'x-oa-origin',
  ORIGIN_KIND: (kind?: DecoratorKind) => [EXTENSIONS.ORIGIN, 'kind', kind].filter(Boolean).join(':'),
};