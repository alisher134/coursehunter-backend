import { isProd } from '@/common/utils/is-prod.utils';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';

@Injectable()
export class RefreshTokenService {
	private EXPIRATION_REFRESH_TOKEN_DAY: number;
	REFRESH_TOKEN_NAME: string;

	constructor(private readonly configService: ConfigService) {
		this.EXPIRATION_REFRESH_TOKEN_DAY = parseInt(
			this.configService.getOrThrow('REFRESH_TOKEN_EXPIRATION'),
			10
		);
		this.REFRESH_TOKEN_NAME = 'refreshToken';
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string): void {
		const expiresIn = new Date();
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRATION_REFRESH_TOKEN_DAY);

		res.cookie(
			this.REFRESH_TOKEN_NAME,
			refreshToken,
			this.getCookieOptions(expiresIn)
		);
	}

	removeRefreshTokenFromResponse(res: Response): void {
		res.cookie(this.REFRESH_TOKEN_NAME, '', this.getCookieOptions(new Date(0)));
	}

	private getCookieOptions(expires: Date): CookieOptions {
		return {
			httpOnly: true,
			secure: isProd(this.configService),
			sameSite: 'lax',
			domain: this.configService.getOrThrow('DOMAIN'),
			expires
		};
	}
}
