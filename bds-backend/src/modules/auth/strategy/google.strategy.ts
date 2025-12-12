import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';

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
      callbackURL: isProduction
        ? process.env.API_URL
        : 'http://localhost:3000/api/auth/google/redirect',
      scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/bigquery.readonly',
        'https://www.googleapis.com/auth/devstorage.full_control',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/cloud-translation',
      ],
    });
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
