import { EnumLang } from '@/common';
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query,
	Req,
	Res
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthResponse } from './auth.response';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { EmailVerificationService } from './email-verification/email-verification.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly refreshTokenService: RefreshTokenService,
		private readonly emailVerificationService: EmailVerificationService
	) {}

	@ApiParam({ name: 'lang', enum: EnumLang })
	@ApiResponse({ type: AuthResponse })
	@ApiBody({ type: RegisterDto })
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(
		@Res({ passthrough: true }) res: Response,
		@Body() dto: RegisterDto
	): Promise<AuthResponse> {
		const { refreshToken, ...response } = await this.authService.register(dto);

		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);

		return response;
	}

	@ApiParam({ name: 'lang', enum: EnumLang })
	@ApiResponse({ type: AuthResponse })
	@ApiBody({ type: LoginDto })
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(
		@Res({ passthrough: true }) res: Response,
		@Body() dto: LoginDto
	): Promise<AuthResponse> {
		const { refreshToken, ...response } = await this.authService.login(dto);

		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);

		return response;
	}

	@ApiParam({ name: 'lang', enum: EnumLang })
	@ApiResponse({ type: AuthResponse })
	@Post('new-tokens')
	@HttpCode(HttpStatus.OK)
	async getNewTokens(
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request
	): Promise<AuthResponse> {
		const refreshTokenFromCookies =
			req.cookies[this.refreshTokenService.REFRESH_TOKEN_NAME];

		const { refreshToken, ...response } = await this.authService.getNewTokens(
			refreshTokenFromCookies
		);

		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);

		return response;
	}

	@ApiParam({ name: 'lang', enum: EnumLang })
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	logout(@Res({ passthrough: true }) res: Response): boolean {
		this.refreshTokenService.removeRefreshTokenFromResponse(res);

		return true;
	}

	@Get('verification')
	@HttpCode(HttpStatus.OK)
	verification(@Query('token') token: string): Promise<{ message: string }> {
		return this.emailVerificationService.verificationEmail(token);
	}
}
