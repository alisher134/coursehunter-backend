import { Module } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { TokenModule } from '../token/token.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailVerificationService } from './email-verification/email-verification.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';

@Module({
	imports: [TokenModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		UserService,
		RefreshTokenService,
		MailService,
		EmailVerificationService
	]
})
export class AuthModule {}
