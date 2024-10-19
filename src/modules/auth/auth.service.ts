import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { User } from '@prisma/client';
import { verify } from 'argon2';
import { I18nService } from 'nestjs-i18n';
import { TokenService } from '../token/token.service';
import { UserDetail } from '../user/user.response';
import { UserService } from '../user/user.service';
import { AuthResponse } from './auth.response';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService,
		private readonly i18n: I18nService
	) {}

	async register(dto: RegisterDto): Promise<AuthResponse> {
		await this.checkExists(dto.email);
		const user = await this.userService.create(dto);

		return await this.buildResponse(user);
	}

	async login(dto: LoginDto): Promise<AuthResponse> {
		const user = await this.validateUser(dto);

		return await this.buildResponse(user);
	}

	async getNewTokens(refreshToken: string): Promise<AuthResponse> {
		if (!refreshToken)
			throw new UnauthorizedException(this.i18n.t('translations.auth.logIn'));

		const result = await this.tokenService.verifyToken(refreshToken);
		if (!result)
			throw new UnauthorizedException(
				this.i18n.t('translations.auth.invalidRefresh')
			);

		const user = await this.userService.findById(result.id);

		return await this.buildResponse(user);
	}

	private async validateUser(dto: LoginDto): Promise<UserDetail> {
		const user = await this.userService.findByEmail(dto.email);
		if (!user)
			throw new BadRequestException(this.i18n.t('translations.auth.validate'));

		const isCorrectPassword = await verify(user.password, dto.password);
		if (!isCorrectPassword)
			throw new BadRequestException(this.i18n.t('translations.auth.validate'));

		return user;
	}

	private async checkExists(email: string): Promise<void> {
		const isExists = await this.userService.findByEmail(email);
		if (isExists)
			throw new BadRequestException(this.i18n.t('translations.auth.isExists'));
	}

	private async buildResponse(user: User): Promise<AuthResponse> {
		const tokens = await this.tokenService.generateTokens(user.id, user.role);

		return {
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				role: user.role
			},
			...tokens
		};
	}
}
