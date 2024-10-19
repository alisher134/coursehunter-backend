import { jwtConfig } from '@/config/jwt.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: jwtConfig
		})
	],
	providers: [TokenService],
	exports: [TokenService, JwtModule]
})
export class TokenModule {}
