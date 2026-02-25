import {OABooleanProperty, OANumberProperty, OAOneOfProperty, OAStringProperty} from "../../../lib";
import {OAObjectPropertyOptional} from "../../../lib/decorators/properties/object.decorator";

export class SuccessResponse {

  @OABooleanProperty()
  success: boolean;

  @OAOneOfProperty([Object, Array])
  data: any;

}

export class ErrorResponse {

  @OABooleanProperty()
  success: boolean;

  @OANumberProperty()
  status: number;

  @OANumberProperty()
  code: string;

  @OAStringProperty()
  message: string;

  @OAObjectPropertyOptional()
  details: any;

}