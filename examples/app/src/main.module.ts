import {Module} from "@nestjs/common";
import {AnimalModule} from "./features/animal/animal.module";
import {MainController} from "./main.controller";

@Module({
  imports: [AnimalModule],
  controllers: [MainController],
})
export class MainModule {}