import { Module } from '@nestjs/common';
import { OATagGroup } from '../../../../../../lib';
import { CatController } from './cat.controller';

@OATagGroup('Animals/Cats', 'All endpoints about cats.')
@Module({
  controllers: [CatController],
})
export class CatModule {}