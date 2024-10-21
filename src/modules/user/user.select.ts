import { Prisma } from '@prisma/client';

export const UserSelect: Prisma.UserSelect = {
	id: true,
	createdAt: true,
	updatedAt: true,
	email: true,
	username: true,
	avatarPath: true,
	isVerified: true,
	isTwoFactorEnabled: true,
	role: true,
	password: false
};
