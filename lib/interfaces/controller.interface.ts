import type {ControllerOptions} from "@nestjs/common";
import type {IOpenApiRequestOptions} from "./request.interface";

export interface IOpenApiControllerOptions extends IOpenApiRequestOptions, ControllerOptions {

}