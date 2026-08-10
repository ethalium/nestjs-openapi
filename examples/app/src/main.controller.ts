import { OAController, OAGet } from '../../../lib';
import { RbacRequires } from './main.rbac';

@OAController('/')
export class MainController {

  @RbacRequires(['health'])
  @OAGet('/health', {
    description: 'Returns the current health status of the application.',
    tags: ['Health']
  })
  health() {}

}