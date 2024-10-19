import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EnumRoles } from '@prisma/client';
import { JwtPayload, Tokens } from './token.response';

@Injectable()
export class TokenService {
	private ACCESS_TOKEN_EXPIRATION: string;
	private REFRESH_TOKEN_EXPIRATION: string;

	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {
		this.ACCESS_TOKEN_EXPIRATION = this.configService.getOrThrow<string>(
			'ACCESS_TOKEN_EXPIRATION'
		);
		this.REFRESH_TOKEN_EXPIRATION = this.configService.getOrThrow<string>(
			'REFRESH_TOKEN_EXPIRATION'
		);
	}

	async generateTokens(userId: string, role: EnumRoles): Promise<Tokens> {
		const payload: JwtPayload = { id: userId, role };

		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.ACCESS_TOKEN_EXPIRATION
		});

		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.REFRESH_TOKEN_EXPIRATION
		});

		return { accessToken, refreshToken };
	}

	async verifyToken(token: string): Promise<JwtPayload> {
		return await this.jwtService.verifyAsync(token);
	}
}
