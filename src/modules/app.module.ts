import { i18nConfig } from '@/config/i18n.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { I18nModule } from 'nestjs-i18n';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';

@Module({
	imports: [
		I18nModule.forRoot(i18nConfig),
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		AuthModule,
		UserModule,
		TokenModule
	]
})
export class AppModule {}
