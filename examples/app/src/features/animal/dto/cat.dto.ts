import {AnimalDto} from "./animal.dto";
import { OAArrayProperty, OAEnumProperty} from "../../../../../../lib";

export class CatDto extends AnimalDto {

  @OAEnumProperty(['cat'])
  type: 'cat';

  @OAArrayProperty({ type: 'string' })
  types: string[];

}