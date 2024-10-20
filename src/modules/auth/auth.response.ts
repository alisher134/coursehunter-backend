import { ApiProperty } from '@nestjs/swagger';
import { EnumRoles } from '@prisma/client';
import { AuthTokens } from '../token/token.response';

export class AuthUser {
	@ApiProperty()
	id: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	username: string;

	@ApiProperty()
	role: EnumRoles;
}

export class AuthResponse extends AuthTokens {
	@ApiProperty()
	user: AuthUser;
}
