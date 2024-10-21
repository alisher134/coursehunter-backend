import { applyDecorators, UseGuards } from '@nestjs/common';
import { EnumRoles } from '@prisma/client';
import { AdminGuard } from '../guards/admin.guard';
import { JwtGuard } from '../guards/jwt.guard';

export const Auth = (
	role: EnumRoles = EnumRoles.USER
): ClassDecorator & MethodDecorator =>
	applyDecorators(
		role === EnumRoles.ADMIN
			? UseGuards(JwtGuard, AdminGuard)
			: UseGuards(JwtGuard)
	);
