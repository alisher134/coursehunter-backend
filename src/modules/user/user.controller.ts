import { EnumLang } from '@/common';
import { Auth } from '@/decorators/auth.decorator';
import { CurrentUser } from '@/decorators/user.decorator';
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Put
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetail } from './user.response';
import { UserService } from './user.service';

@ApiTags('USER')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiParam({ name: 'lang', enum: EnumLang })
	@Get('profile')
	@Auth()
	@HttpCode(HttpStatus.OK)
	getProfile(@CurrentUser('id') id: string): Promise<UserDetail | undefined> {
		return this.userService.findById(id);
	}

	@ApiBody({ type: UpdateUserDto })
	@Put('profile')
	@Auth()
	@HttpCode(HttpStatus.OK)
	updateProfile(
		@CurrentUser('id') id: string,
		@Body() dto: UpdateUserDto
	): Promise<UserDetail> {
		return this.userService.update(id, dto);
	}

	//Admin endpoints

	@ApiParam({ name: 'lang', enum: EnumLang })
	@Get(':id')
	@Auth('ADMIN')
	@HttpCode(HttpStatus.OK)
	getUser(@Param('id') id: string): Promise<UserDetail | undefined> {
		return this.userService.findById(id);
	}

	@ApiBody({ type: UpdateUserDto })
	@Put(':id')
	@Auth('ADMIN')
	@HttpCode(HttpStatus.OK)
	updateUser(
		@Param('id') id: string,
		@Body() dto: UpdateUserDto
	): Promise<UserDetail> {
		return this.userService.update(id, dto);
	}
}
