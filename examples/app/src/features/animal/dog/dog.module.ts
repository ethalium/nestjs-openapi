import { Module } from '@nestjs/common';
import { DogController } from './dog.controller';
import { OATagGroup } from '../../../../../../lib';

@OATagGroup('Animals/Dogs', 'All endpoints about dogs.')
@Module({
  controllers: [DogController],
})
export class DogModule {}