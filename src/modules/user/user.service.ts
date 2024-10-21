import { faker } from '@faker-js/faker';
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { EnumRoles, Prisma } from '@prisma/client';
import { hash } from 'argon2';
import { I18nService } from 'nestjs-i18n';
import { RegisterDto } from '../auth/dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetail } from './user.response';
import { UserSelect } from './user.select';

@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly i18n: I18nService
	) {}

	async findById(id: string): Promise<UserDetail | undefined> {
		const user = await this.prismaService.user.findUnique({
			where: { id },
			select: UserSelect
		});

		if (!user)
			throw new NotFoundException(this.i18n.t('translations.user.notFound'));

		return user;
	}

	async findByEmail(email: string): Promise<UserDetail | undefined> {
		return await this.prismaService.user.findUnique({ where: { email } });
	}

	async update(id: string, dto: UpdateUserDto): Promise<UserDetail> {
		const user = await this.findById(id);
		const isSameUser = await this.findByEmail(dto.email);

		if (isSameUser && id !== isSameUser.id)
			throw new BadRequestException(this.i18n.t('translations.auth.isExists'));

		return await this.prismaService.user.update({
			where: {
				email: dto.email
			},
			select: UserSelect,
			data: {
				...dto,
				password: dto.password
					? await this.hashedPassword(dto.password)
					: user.password,
				role: dto.role ? dto.role : EnumRoles.USER
			}
		});
	}

	async create(dto: RegisterDto): Promise<UserDetail> {
		const userData: Prisma.UserCreateInput = {
			...dto,
			password: await this.hashedPassword(dto.password),
			avatarPath: faker.image.avatar()
		};

		return await this.prismaService.user.create({
			data: userData
		});
	}

	private async hashedPassword(password: string): Promise<string> {
		return await hash(password);
	}
}
