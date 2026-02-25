import {IOpenApiRequestOptions} from "../interfaces/request.interface";
import {createDecorator} from "../utils/decorator.utils";
import {ApiExcludeController, ApiExcludeEndpoint} from "@nestjs/swagger";
import {OAParams} from "./param.decorator";
import {OATag} from "./tag.decorator";
import {OATagGroup} from "./tag-group.decorator";
import {OAHeaders} from "./header.decorator";
import {OAQueries} from "./query.decorator";

/** @internal */
export function OARequest(type: 'route'|'controller', options: IOpenApiRequestOptions): ClassDecorator & MethodDecorator {
  return createDecorator({
    decorators: (_, store) => {

      // add exclude @ApiExcludeController decorator if options.exclude is true and end function
      if(options.exclude){
        return store.push(type === 'route' ? ApiExcludeEndpoint() : ApiExcludeController());
      }

      // add tags
      if(options.tags){
        options.tags.map(tag => {
          store.push(OATag(tag as any));
        });
      }

      // add tag groups
      if(options.tagGroups){
        options.tagGroups.map(tagGroup => {
          store.push(OATagGroup(tagGroup as any));
        });
      }

      // add headers
      if(options.headers){
        store.push(OAHeaders(options.headers));
      }

      // add params
      if(options.params){
        store.push(OAParams(options.params));
      }

      // add queries
      if(options.query){
        store.push(OAQueries(options.query));
      }

    }
  })() as any;
}