import {AnimalDto} from "./animal.dto";
import {OAEnumProperty} from "../../../../../../lib";

export class DogDto extends AnimalDto {

  @OAEnumProperty(['dog'])
  type: 'dog';

}