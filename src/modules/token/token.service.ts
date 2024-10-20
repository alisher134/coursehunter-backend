import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EnumRoles, EnumToken, Prisma, Token } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthTokens, JwtPayload } from './token.response';

@Injectable()
export class TokenService {
	private ACCESS_TOKEN_EXPIRATION: string;
	private REFRESH_TOKEN_EXPIRATION: string;

	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService
	) {
		this.ACCESS_TOKEN_EXPIRATION = this.configService.getOrThrow<string>(
			'ACCESS_TOKEN_EXPIRATION'
		);
		this.REFRESH_TOKEN_EXPIRATION = this.configService.getOrThrow<string>(
			'REFRESH_TOKEN_EXPIRATION'
		);
	}

	async generateTokens(userId: string, role: EnumRoles): Promise<AuthTokens> {
		const payload: JwtPayload = { id: userId, role };

		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.ACCESS_TOKEN_EXPIRATION
		});

		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.REFRESH_TOKEN_EXPIRATION
		});

		return { accessToken, refreshToken };
	}

	async generateToken(
		email: string,
		expiresIn: string,
		type: EnumToken
	): Promise<Token> {
		const existToken = await this.prismaService.token.findFirst({
			where: { email, type }
		});

		if (existToken) {
			await this.prismaService.token.delete({
				where: { id: existToken.id, type }
			});
		}

		const tokenData: Prisma.TokenCreateInput = {
			token: await this.jwtService.signAsync({ email }, { expiresIn }),
			email,
			expiresIn,
			type
		};

		return await this.prismaService.token.create({
			data: tokenData
		});
	}

	async verifyToken(token: string): Promise<JwtPayload> {
		return await this.jwtService.verifyAsync(token);
	}
}
