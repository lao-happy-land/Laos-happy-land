import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { log } from 'console';
import { GoogleAuthGuard } from './guard/google.guard';
import { ResetPasswordDto } from './dto/reset_pass.dto';
import { Response } from 'express';
import { RefreshTokenDto } from './dto/refersh.dto';
import { VerifyEmaildDto } from './dto/verify_email.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or user already exists',
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login an existing user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'New access token generated' })
  @ApiBody({ type: RefreshTokenDto })
  async refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refresh_token);
  }

  @Get('google/login')
  @ApiOperation({ summary: 'Login via Google' })
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin() {
    return { message: 'Redirecting to Google login...' };
  }

  
  // @Get('google/redirect')
  // @ApiOperation({ summary: 'Google OAuth callback' })
  // @UseGuards(GoogleAuthGuard)
  // async googleAuthRedirect(@Req() req, @Res() res: Response) {
  //   const { access_token, refresh_token } = req.user;
  //   const FE_URL = process.env.FRONTEND_URL;

  //   return res.redirect(
  //     `${FE_URL}?access_token=${access_token}&refresh_token=${refresh_token}`,
  //   );
  // }


  @Get('google/redirect')
  @ApiOperation({ summary: 'Google OAuth callback' })
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const token = req.user.access_token;
    const FE_URL = process.env.FRONTEND_URL;

    return res.redirect(`${FE_URL}?token=${token}`);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify gmail' })
  @ApiResponse({ status: 200, description: 'Email is valid' })
  @ApiResponse({ status: 400, description: 'Email not found' })
  @ApiBody({ type: VerifyEmaildDto })
  async verifyUserRole(@Body() body: VerifyEmaildDto) {
    return this.authService.verifyEmail(body);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password successfully reset' })
  @ApiResponse({ status: 400, description: 'Invalid email or input' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { email, newPassword } = body;
    if (!email || !newPassword) {
      throw new BadRequestException('Email and new password are required');
    }
    const user = await this.authService.resetPassword(body);
    return { message: 'Password successfully reset'};
  }
}
