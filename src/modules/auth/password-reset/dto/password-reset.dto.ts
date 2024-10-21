import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class PasswordResetDto {
	@ApiProperty()
	@MinLength(8)
	password: string;
}
