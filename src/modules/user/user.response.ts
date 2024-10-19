import { ApiProperty } from '@nestjs/swagger';
import { EnumRoles } from '@prisma/client';

export class UserDetail {
	@ApiProperty()
	id: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;

	@ApiProperty()
	email: string;

	@ApiProperty({ writeOnly: true })
	password: string;

	@ApiProperty()
	username: string;

	@ApiProperty()
	avatarPath: string;

	@ApiProperty()
	role: EnumRoles;

	@ApiProperty()
	isVerified: boolean;

	@ApiProperty()
	isTwoFactorEnabled: boolean;
}
