import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { log } from 'console';
import { GoogleAuthGuard } from './guard/google.guard';

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

  @Get('google/login')
  @ApiOperation({ summary: 'Login via Google' })
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin() {
    return { message: 'Redirecting to Google login...' };
  }

  @Get('google/redirect')
  @ApiOperation({ summary: 'Google OAuth callback' })
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req) {
    return { access_token: req.user.access_token };
  }
}
