import { OABooleanProperty, OAExtension, OAStringProperty, OAStringPropertyOptional } from '../../../../../../lib';

export class AnimalDto {

  @OABooleanProperty()
  active!: boolean;

  @OAExtension('x-order', 2)
  @OAStringProperty()
  name!: string;

  @OAExtension('x-order', 1)
  @OAStringPropertyOptional()
  comment?: string|null;

}