import { OAController, OAGet } from '../../../lib';
import { RbacRequires } from './main.rbac';
import { OAOperation } from '../../../lib/decorators/operation.decorator';

@OAController('/')
export class MainController {

  @RbacRequires(['health'])
  @OAOperation({ summary: 'Summary' })
  @OAOperation({ deprecated: true })
  @OAGet('/health', {
    description: 'Returns the current health status of the application.',
    tags: ['Health']
  })
  health() {}

}