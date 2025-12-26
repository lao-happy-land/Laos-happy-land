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
import { GoogleAuthGuard } from './guard/google.guard';
import { Response } from 'express';
import { RefreshTokenDto } from './dto/refersh.dto';
import { SendResetCodeDto } from './dto/send-reset-code.dto';
import { VerifyResetCodeDto } from './dto/verify-reset-code.dto';
import { ResetPasswordWithCodeDto } from './dto/reset-password-with-code.dto';
import { TestRedisDto } from './dto/test-redis.dto';

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

  @Post('send-reset-code')
  @ApiOperation({ summary: 'Send password reset code to email' })
  @ApiResponse({ status: 200, description: 'Reset code sent successfully' })
  @ApiResponse({ status: 400, description: 'Email not found' })
  @ApiBody({ type: SendResetCodeDto })
  async sendResetCode(@Body() body: SendResetCodeDto) {
    return this.authService.sendResetCode(body.email);
  }

  @Post('verify-reset-code')
  @ApiOperation({ summary: 'Verify password reset code' })
  @ApiResponse({ status: 200, description: 'Code verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired code' })
  @ApiBody({ type: VerifyResetCodeDto })
  async verifyResetCode(@Body() body: VerifyResetCodeDto) {
    return this.authService.verifyResetCode(body.email, body.code);
  }

  @Post('reset-password-with-code')
  @ApiOperation({ summary: 'Reset password with verification code' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid code or email' })
  @ApiBody({ type: ResetPasswordWithCodeDto })
  async resetPasswordWithCode(@Body() body: ResetPasswordWithCodeDto) {
    return this.authService.resetPasswordWithCode(body.email, body.code, body.newPassword);
  }
}
