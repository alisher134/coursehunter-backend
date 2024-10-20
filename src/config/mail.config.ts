import { API_NAME } from '@/common/constants';
import { isProd } from '@/common/utils/is-prod.utils';
import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export const mailConfig = async (
	configService: ConfigService
): Promise<MailerOptions> => ({
	transport: {
		host: configService.get('SMTP_SERVER'),
		port: 465,
		secure: isProd(configService),
		auth: {
			user: configService.get('SMTP_LOGIN'),
			pass: configService.get('SMTP_PASSWORD')
		}
	},
	defaults: {
		from: `${API_NAME} ${configService.get('MAIL_LOGIN')}`
	}
});
