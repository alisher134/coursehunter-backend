import { i18nConfig } from '@/config/i18n.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { I18nModule } from 'nestjs-i18n';
import { PrismaModule } from './prisma/prisma.module';

@Module({
	imports: [
		I18nModule.forRoot(i18nConfig),
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule
	]
})
export class AppModule {}
