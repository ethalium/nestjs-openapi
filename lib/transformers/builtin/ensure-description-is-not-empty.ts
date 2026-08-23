import { createOperationTransformer } from '../operation.transformer';

export const EnsureDescriptionIsNotEmpty = createOperationTransformer({
  transform: (context) => {

    // ensure the operation description is not empty
    context.operationObject.description ??= '';

    // ensure the response description is not empty
    Object.values(context.operationObject.responses ?? {}).forEach((response: any)=> {

      // skip if response is undefined or a reference is defined
      if(!response || ('$ref' in response)){
        return;
      }

      // ensure description is not empty
      response.description ??= '';

    });

  }
})