import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { I18nService, TranslateOptions } from 'nestjs-i18n';
import { WelcomeTemplate } from './templates/welcome.template';

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService,
		private readonly i18n: I18nService
	) {}

	async sendWelcome(to: string, username: string): Promise<void> {
		const html = await render(
			WelcomeTemplate({
				username,
				t: (key: string, options: TranslateOptions) => this.i18n.t(key, options)
			})
		);

		return this.sendEmail(to, 'Спасибо за регистрацию!', html);
	}

	sendEmail(to: string, subject: string, html: string): Promise<void> {
		return this.mailerService.sendMail({
			to,
			subject,
			html
		});
	}
}
