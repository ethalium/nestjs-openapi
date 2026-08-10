import { AnimalDto } from './animal.dto';
import { OAArrayProperty, OAEnumProperty, OATypeProperty } from '../../../../../../lib';

export class CatDto extends AnimalDto {

  @OAEnumProperty(['cat'])
  type!: 'cat';

  @OAArrayProperty({ type: 'string' })
  types!: string[];

  @OATypeProperty(() => [CatDto])
  siblings!: CatDto[];

}