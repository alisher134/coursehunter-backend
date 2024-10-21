import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { API_NAME } from './common/constants';
import { AppModule } from './modules/app.module';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);
	const config = app.get(ConfigService);

	const options = new DocumentBuilder()
		.setTitle(API_NAME)
		.setDescription(`The ${API_NAME} API description`)
		.setVersion('1.0')
		.build();
	const documentFactory = (): OpenAPIObject =>
		SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, documentFactory);

	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(
		new I18nValidationExceptionFilter({
			detailedErrors: false
		})
	);
	app.setGlobalPrefix('api/v1');
	app.enableCors({
		origin: config.getOrThrow<string>('CLIENT_URL'),
		credentials: true,
		exposedHeaders: ['set-cookie']
	});

	const port = config.getOrThrow<number>('PORT') ?? 4000;

	await app.listen(port);
}
bootstrap();
