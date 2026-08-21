import { createOperationTransformer } from '../operation.transformer';

export const EnsureDescription = createOperationTransformer({
  transform: (context) => {

    // ensure the operation description is not empty
    context.operationObject.description ??= '';

    // ensure the response description is not empty
    Object.values(context.operationObject.responses ?? {}).forEach((response)=> {
      if(response && !('$ref' in response)){
        response.description ??= '';
      }
    });

  }
})