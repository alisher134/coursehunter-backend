import { Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';
import { MailService } from '../mail/mail.service';

@Module({
	imports: [TokenModule],
	controllers: [AuthController],
	providers: [AuthService, UserService, RefreshTokenService, MailService]
})
export class AuthModule {}
