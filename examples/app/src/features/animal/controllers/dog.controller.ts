import { OAController, OAInternalServerError } from '../../../../../../lib';
import { OAGet } from '../../../../../../lib/decorators/routes/get.decorator';
import { DogDto } from '../dto/dog.dto';
import { RbacRequires } from '../../../main.rbac';

@RbacRequires(['animal.dog'])
@OAController('/animals/dogs', {
  tags: ['Dogs'],
})
@OAInternalServerError()
export class DogController {

  @RbacRequires(['animal.dog.list'])
  @OAGet({
    summary: 'List Dogs',
    description: 'Returns a list of dogs.',
    response: [DogDto]
  })
  list() {
    return [];
  }

  @RbacRequires(['animal.dog.get'])
  @OAGet('/:id', {
    summary: 'Get Dog by Id',
    description: 'Returns a dog by its ID.',
    response: DogDto,
  })
  getById() {
    return {};
  }

}