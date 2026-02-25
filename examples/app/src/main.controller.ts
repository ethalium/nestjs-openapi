import {OAController, OAGet} from "../../../lib";

@OAController('/')
export class MainController {

  @OAGet('/health', {
    tags: ['Health']
  })
  health() {}

}