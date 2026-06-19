import {AnimalDto} from "./animal.dto";
import { OAArrayProperty, OAEnumProperty, OAProperty, OATypeProperty } from '../../../../../../lib';
import { ApiProperty } from '@nestjs/swagger';

export class CatDto extends AnimalDto {

  @OAEnumProperty(['cat'])
  type!: 'cat';

  @OAArrayProperty({ type: 'string' })
  types!: string[];

  @OATypeProperty(() => [CatDto])
  siblings!: CatDto[];

}