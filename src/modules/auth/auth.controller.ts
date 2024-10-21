import { EnumLang } from '@/common';
import { Auth } from '@/decorators/auth.decorator';
import { CurrentUser } from '@/decorators/user.decorator';
import {
	Body,
	Controller,
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
import { PasswordResetDto } from './password-reset/dto/password-reset.dto';
import { PasswordResetService } from './password-reset/password-reset.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly refreshTokenService: RefreshTokenService,
		private readonly emailVerificationService: EmailVerificationService,
		private readonly passwordResetService: PasswordResetService
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

	@ApiParam({ name: 'lang', enum: EnumLang })
	@Post('verification')
	@HttpCode(HttpStatus.OK)
	verification(@Query('token') token: string): Promise<{ message: string }> {
		return this.emailVerificationService.verificationEmail(token);
	}

	@ApiParam({ name: 'lang', enum: EnumLang })
	@Auth()
	@Post('password-reset')
	@HttpCode(HttpStatus.OK)
	passwordReset(@CurrentUser('email') email: string): Promise<boolean> {
		return this.passwordResetService.reset(email);
	}

	@ApiParam({ name: 'lang', enum: EnumLang })
	@ApiBody({ type: PasswordResetDto })
	@Post('new-password')
	@HttpCode(HttpStatus.OK)
	newPassword(
		@Body() dto: PasswordResetDto,
		@Query('token') token: string
	): Promise<{ message: string }> {
		return this.passwordResetService.newPasswordReset(token, dto);
	}
}
