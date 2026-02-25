import {OAController, OAInternalServerError} from "../../../../../../lib";
import {OAGet} from "../../../../../../lib/decorators/routes/get.decorator";
import {CatDto} from "../dto/cat.dto";
import {ErrorResponse} from "../../../main.types";

@OAController('/animals/cats', {
  tags: ['Cats'],
})
@OAInternalServerError(ErrorResponse)
export class CatController {

  @OAGet({
    summary: 'List Cats',
    response: [CatDto]
  })
  list() {
    return [];
  }

  @OAGet('/:id', {
    summary: 'Get Cat by Id',
    response: CatDto,
  })
  getById() {
    return {};
  }

}