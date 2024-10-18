import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);
	const config = app.get(ConfigService);

	app.use(cookieParser());
	app.setGlobalPrefix('api/v1');
	app.enableCors({
		allowedHeaders: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['set-cookie']
	});

	const port = config.getOrThrow<number>('PORT') ?? 4000;

	await app.listen(port);
}
bootstrap();
