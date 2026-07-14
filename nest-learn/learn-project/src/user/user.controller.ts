import { Controller, Get, Req, Param, Post, Body} from '@nestjs/common';
import type { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
@Controller('user')
export class UserController {
    @Get()
    getHello(@Req() req: Request): string {
        return 'Hello World!';
    }

    @Get(':id')
    findOne(@Param() params: any): string {
        console.log(params.id);
        return `This action returns a #${params.id} cat`;
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return 'This action adds a new user';
    }
}

