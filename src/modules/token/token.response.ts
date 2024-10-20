import { ApiProperty } from '@nestjs/swagger';
import { EnumRoles } from '@prisma/client';

export interface JwtPayload {
	id: string;
	role: EnumRoles;
}

export class AuthTokens {
	@ApiProperty()
	accessToken: string;

	@ApiProperty()
	refreshToken?: string;
}
