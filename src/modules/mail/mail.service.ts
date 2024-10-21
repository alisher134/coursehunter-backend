import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { I18nService, TranslateOptions } from 'nestjs-i18n';
import { EmailVerification } from './templates/email-verification.template';
import { ResetPasswordTemplate } from './templates/password-reset.template';
import { WelcomeTemplate } from './templates/welcome.template';

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService,
		private readonly i18n: I18nService
	) {}

	async sendWelcome(to: string, username: string): Promise<void> {
		const link = this.configService.get('CLIENT_URL');
		const html = await render(
			WelcomeTemplate({
				username,
				link,
				t: (key: string, options: TranslateOptions) => this.i18n.t(key, options)
			})
		);

		return this.sendEmail(
			to,
			this.i18n.t('translations.welcome.heading'),
			html
		);
	}

	async sendPasswordReset(email: string, token: string): Promise<void> {
		const domain = this.configService.get('CLIENT_URL');
		const html = await render(
			ResetPasswordTemplate({
				domain,
				token,
				t: (key: string, options: TranslateOptions) => this.i18n.t(key, options)
			})
		);

		return this.sendEmail(
			email,
			this.i18n.t('translations.passwordReset.heading'),
			html
		);
	}

	async sendVerificationEmail(
		email: string,
		username: string,
		token: string
	): Promise<void> {
		const domain = this.configService.get('CLIENT_URL');
		const html = await render(
			EmailVerification({
				domain,
				token,
				username,
				t: (key: string, options: TranslateOptions) => this.i18n.t(key, options)
			})
		);

		return this.sendEmail(
			email,
			this.i18n.t('translations.verificationEmail.heading'),
			html
		);
	}

	sendEmail(
		to: string,
		subject: string,
		html: string,
		from: string = 'coursehunter@help.kz'
	): Promise<void> {
		return this.mailerService.sendMail({
			from,
			to,
			subject,
			html
		});
	}
}
