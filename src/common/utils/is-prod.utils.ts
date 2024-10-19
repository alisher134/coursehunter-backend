import { ConfigService } from '@nestjs/config';

export const isProd = (configService: ConfigService): boolean =>
	configService.getOrThrow<string>('NODE_ENV') === 'production';
