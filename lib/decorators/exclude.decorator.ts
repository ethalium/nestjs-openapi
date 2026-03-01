import { AllDecorator, createDecorator, } from '../utils/decorator.utils';
import { ApiExcludeController, ApiHideProperty } from '@nestjs/swagger';

export function OAExclude(disable?: boolean): AllDecorator {
  return createDecorator({
    decorators: (ctx, store) => {
      if(!disable){
        switch(ctx.kind){
          case 'class': return store.push(ApiExcludeController());
          case 'method': return store.push(ApiExcludeController());
          case 'property': return store.push(ApiHideProperty());
          case 'parameter': return store.push(ApiHideProperty());
        }
      }
    }
  })() as any;
}