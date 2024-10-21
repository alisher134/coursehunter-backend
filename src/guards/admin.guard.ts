import {
	CanActivate,
	ExecutionContext,
	ForbiddenException
} from '@nestjs/common';
import { EnumRoles, User } from '@prisma/client';

export class AdminGuard implements CanActivate {
	canActivate(ctx: ExecutionContext): boolean {
		const { user } = ctx.switchToHttp().getRequest<{ user: User }>();

		if (user.role !== EnumRoles.ADMIN)
			throw new ForbiddenException('У вас нет прав!');

		return true;
	}
}