import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';

import { AppModule } from './app.module';

const port = process.env.PORT || 4000;

let server;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();

  return serverlessExpress({ app: expressApp });
}
export async function handler(event, context, callback) {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
}
