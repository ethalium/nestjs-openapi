import { OAController, OAInternalServerError, OAQueryMethod } from '../../../../../../lib';
import { OAGet } from '../../../../../../lib/decorators/routes/get.decorator';
import { CatDto } from '../dto/cat.dto';
import { ErrorResponse } from '../../../main.types';
import { RbacRequires } from '../../../main.rbac';

@RbacRequires(['animal.cat'])
@OAController('/animals/cats', {
  tags: ['Cats'],
})
@OAInternalServerError(ErrorResponse)
export class CatController {

  @RbacRequires(['animal.cat.list'])
  @OAQueryMethod({
    summary: 'List Cats',
    description: 'Returns a list of cats.',
    response: [CatDto]
  })
  list() {
    return [];
  }

  @RbacRequires(['animal.cat.get'])
  @OAGet('/:id', {
    summary: 'Get Cat by Id',
    description: 'Returns a cat by its ID.',
    response: CatDto,
  })
  getById() {
    return {};
  }

}