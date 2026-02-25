import {AnimalDto} from "./animal.dto";
import {OAEnumProperty} from "../../../../../../lib";

export class CatDto extends AnimalDto {

  @OAEnumProperty(['cat'])
  type: 'cat';

}