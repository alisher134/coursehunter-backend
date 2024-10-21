import { MailService } from '@/modules/mail/mail.service';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { TokenService } from '@/modules/token/token.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EnumToken, Token } from '@prisma/client';
import { hash } from 'argon2';
import { I18nService } from 'nestjs-i18n';
import { PasswordResetDto } from './dto/password-reset.dto';

@Injectable()
export class PasswordResetService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly tokenService: TokenService,
		private readonly mailService: MailService,
		private readonly i18n: I18nService
	) {}

	async reset(email: string): Promise<boolean> {
		const user = await this.prismaService.user.findUnique({
			where: { email }
		});

		if (!user)
			throw new NotFoundException(this.i18n.t('translations.user.notFound'));

		const passwordResetToken = await this.generatePasswordResetToken(
			user.email,
			'1h'
		);

		await this.mailService.sendPasswordReset(email, passwordResetToken.token);

		return true;
	}

	async newPasswordReset(
		token: string,
		dto: PasswordResetDto
	): Promise<{ message: string }> {
		const existsToken = await this.prismaService.token.findFirst({
			where: {
				token,
				type: EnumToken.PASSWORD_RESET
			}
		});

		if (!existsToken)
			throw new NotFoundException(this.i18n.t('translations.notFoundToken'));

		const user = await this.prismaService.user.findFirst({
			where: {
				email: existsToken.email
			}
		});

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				password: await hash(dto.password)
			}
		});

		await this.prismaService.token.delete({
			where: {
				id: existsToken.id,
				type: EnumToken.PASSWORD_RESET
			}
		});

		return {
			message: this.i18n.t('translations.passwordReset.message')
		};
	}

	async generatePasswordResetToken(
		email: string,
		expiresIn: string
	): Promise<Token> {
		return await this.tokenService.generateToken(
			email,
			EnumToken.PASSWORD_RESET,
			expiresIn
		);
	}
}
