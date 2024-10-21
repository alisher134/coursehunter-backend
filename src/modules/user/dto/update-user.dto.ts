import { ApiProperty } from '@nestjs/swagger';
import { EnumRoles } from '@prisma/client';
import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator';

export class UpdateUserDto {
	@ApiProperty()
	@IsEmail()
	email: string;

	@IsOptional()
	@ApiProperty()
	@IsString()
	@MinLength(8)
	password: string;

	@IsOptional()
	@ApiProperty()
	@IsString()
	@MinLength(3)
	username: string;

	@IsOptional()
	@ApiProperty()
	@IsString()
	avatarPath: string;

	@IsOptional()
	@ApiProperty()
	@IsEnum(EnumRoles)
	role: EnumRoles;
}
