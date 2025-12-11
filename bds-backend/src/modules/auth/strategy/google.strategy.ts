import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {
    const isProduction = process.env.NODE_ENV === 'production';
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        'https://laos-happy-land.onrender.com/api/auth/google/redirect',
      scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/bigquery.readonly',
        'https://www.googleapis.com/auth/devstorage.full_control',
        'https://www.googleapis.com/auth/cloud-translation',
      ],
    });
  }

  authorizationParams(): Record<string, string> {
    return {
      prompt: 'consent',
      access_type: 'offline',
    };
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    try {
      const { access_token, refresh_token } =
        await this.authService.validateUserFromGoogle(profile);
      return { access_token, refresh_token };
    } catch (error) {
      throw error;
    }
  }
}
