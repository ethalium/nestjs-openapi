import {ControllerOptions} from "@nestjs/common";
import {IOpenApiRequestOptions} from "./request.interface";

export interface IOpenApiControllerOptions extends IOpenApiRequestOptions, ControllerOptions {

}