import { PrismaService } from '@/modules/prisma/prisma.service';
import { TokenService } from '@/modules/token/token.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EnumToken, Token } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class EmailVerificationService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly tokenService: TokenService,
		private readonly i18n: I18nService
	) {}

	async verificationEmail(token: string): Promise<{ message: string }> {
		const existsToken = await this.prismaService.token.findFirst({
			where: {
				token,
				type: EnumToken.VERIFICATION
			}
		});

		if (!existsToken)
			throw new NotFoundException(
				this.i18n.t('translations.verificationEmail.notFoundToken')
			);

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
				isVerified: true
			}
		});

		await this.prismaService.token.delete({
			where: {
				id: existsToken.id,
				type: EnumToken.VERIFICATION
			}
		});

		return {
			message: this.i18n.t('translations.verificationEmail.message')
		};
	}

	async generateVerificationToken(
		email: string,
		expiresIn: string
	): Promise<Token> {
		return await this.tokenService.generateToken(
			email,
			EnumToken.VERIFICATION,
			expiresIn
		);
	}
}
