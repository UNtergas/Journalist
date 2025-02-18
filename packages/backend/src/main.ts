import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { CONFIG } from "./env.config";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // validate incoming data with class-validator
  app.useGlobalPipes(new ValidationPipe());
  // parse cookies
  app.use(cookieParser());
  // swagger
  const config = new DocumentBuilder()
    .setTitle("Project Option")
    .setDescription("Stage rapport API description")
    .setVersion("1.0")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, documentFactory);
  await app.listen(CONFIG.PORT);
}
bootstrap();
