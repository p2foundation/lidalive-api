import { Logger, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SERVER_PORT } from './constants';
import { FallbackExceptionFilter } from './filters/fallback.filter';
import { HttpExceptionFilter } from './filters/http.filter';
import { ValidationException } from './filters/validation.exception';


async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe());


  const port = process.env.PORT || SERVER_PORT;
  await app.listen(port);
  logger.debug(`lidalive app server listening on PORT: ${port}`);
}

bootstrap();
