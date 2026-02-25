import {Module} from "@nestjs/common";
import {OATagGroup} from "../../../../../lib";
import {CatController} from "./controllers/cat.controller";
import {DogController} from "./controllers/dog.controller";

@OATagGroup('Animals', 'All endpoints about Animals.')
@Module({
  controllers: [CatController, DogController],
})
export class AnimalModule {}