import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);
	const config = app.get(ConfigService);

	const options = new DocumentBuilder()
		.setTitle('CurseHunter')
		.setDescription('The CurseHunter API description')
		.setVersion('1.0')
		.build();
	const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, documentFactory);

	app.use(cookieParser());
	app.setGlobalPrefix('api/v1');
	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['set-cookie']
	});

	const port = config.getOrThrow<number>('PORT') ?? 4000;

	await app.listen(port);
}
bootstrap();
