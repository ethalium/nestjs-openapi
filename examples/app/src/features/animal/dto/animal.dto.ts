import {OABooleanProperty, OAStringProperty, OAStringPropertyOptional} from "../../../../../../lib";

export class AnimalDto {

  @OABooleanProperty()
  active: boolean;

  @OAStringProperty()
  name: string;

  @OAStringPropertyOptional()
  comment?: string|null;

}