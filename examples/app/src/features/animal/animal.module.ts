import { Module } from '@nestjs/common';
import { OATagGroup } from '../../../../../lib';
import { CatModule } from './cat/cat.module';
import { DogModule } from './dog/dog.module';

@OATagGroup('Animals', 'All endpoints about Animals.')
@Module({
  imports: [CatModule, DogModule]
})
export class AnimalModule {}