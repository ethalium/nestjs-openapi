import {OAController, OAInternalServerError} from "../../../../../../lib";
import {OAGet} from "../../../../../../lib/decorators/routes/get.decorator";
import {DogDto} from "../dto/dog.dto";

@OAController('/animals/dogs', {
  tags: ['Dogs'],
})
@OAInternalServerError()
export class DogController {

  @OAGet({
    summary: 'List Dogs',
    response: [DogDto]
  })
  list() {
    return [];
  }

  @OAGet('/:id', {
    summary: 'Get Dog by Id',
    response: DogDto,
  })
  getById() {
    return {};
  }

}