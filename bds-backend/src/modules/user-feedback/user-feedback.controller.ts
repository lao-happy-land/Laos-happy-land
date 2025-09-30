import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserFeedbackService } from './user-feedback.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserFeedbackDto } from './dto/create_user_feedback.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';
import { GetUserFeedbackDto } from './dto/get_user_feedback.dto';

@Controller('user-feedback')
export class UserFeedbackController {
  constructor(private readonly userFeedbackService: UserFeedbackService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create user feedback' })
  @ApiResponse({ status: 201, description: 'Success' })
  async create(
    @Body() createUserFeedbackDto: CreateUserFeedbackDto,
    @Req() req: Request,
  ) {
    const payload = req.user as { sub: string };

    return this.userFeedbackService.create(createUserFeedbackDto, payload.sub);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get feedback list by user id' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getByUserId(
    @Param('userId') userId: string,
    @Query() params: GetUserFeedbackDto,
  ) {
    return this.userFeedbackService.getFeedbackByUserId(params, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feedback detail by id' })
  async getById(@Param('id') id: string) {
    return this.userFeedbackService.get(id);
  }
}
