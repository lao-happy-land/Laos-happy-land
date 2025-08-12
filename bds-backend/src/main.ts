import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(){
  const app = await NestFactory.create(AppModule);
  app.enableCors()

  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API cho website bất động sản')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, doc);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
