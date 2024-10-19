import { ApiProperty } from '@nestjs/swagger';
import { EnumRoles } from '@prisma/client';
import { Tokens } from '../token/token.response';

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

export class AuthResponse extends Tokens {
	@ApiProperty()
	user: AuthUser;
}
