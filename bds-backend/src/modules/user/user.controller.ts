import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create_user.dto';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetUserDto } from './dto/get_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { AuthGuard, RoleGuard } from '../auth/guard/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'fullName', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  async getAll(@Query() params: GetUserDto) {
    return this.userService.getAll(params);
  }

  @Get('bank-requests')
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'fullName', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of bank requests' })
  async getBankRequests(@Query() params: GetUserDto) {
    return this.userService.getBankRequests(params);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'User found successfully' })
  async get(@Param('id') id: string) {
    return this.userService.get(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.userService.update(id, updateUserDto);
    return { result, message: 'User updated successfully' };
  }

  @Patch(':id/request')
  // @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Request to be from bank submitted successfully',
  })
  async requestIsFromBank(@Param('id') id: string) {
    return this.userService.requestIsFromBank(id);
  }

  @Patch(':id/approve')
  // @UseGuards(AuthGuard)
  @ApiBody({
    schema: { type: 'object', properties: { approve: { type: 'boolean' } } },
  })
  @ApiResponse({
    status: 200,
    description: 'Admin approved/rejected user as from bank',
  })
  async approveIsFromBank(
    @Param('id') id: string,
    @Body('approve') approve: boolean,
  ) {
    return this.userService.approveIsFromBank(id, approve);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
