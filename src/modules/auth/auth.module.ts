import { Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';

@Module({
	imports: [TokenModule],
	controllers: [AuthController],
	providers: [AuthService, UserService, RefreshTokenService]
})
export class AuthModule {}
