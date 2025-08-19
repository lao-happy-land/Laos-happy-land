import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserRoleDto } from './dto/create_user_role.dto';
import { GetUserRoleDto } from './dto/get_user_role.dto';

@Controller('user-role')
export class UserRoleController {
    constructor(private readonly userRoleService: UserRoleService) {}

    @Post()
    @ApiOperation({ summary: 'Create user role' })
    @ApiResponse({ status: 201, description: 'Success' })
    async create(@Body() createUserRoleDto: CreateUserRoleDto) {
        return this.userRoleService.create(createUserRoleDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all user roles' })
    @ApiResponse({ status: 200, description: 'Success' })
    async getAll(@Query() query: GetUserRoleDto) {
        return this.userRoleService.getAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user role by id' })
    @ApiResponse({ status: 200, description: 'Success' })
    async get(@Param('id') id: string) {
        return this.userRoleService.get(id);
    }
}
