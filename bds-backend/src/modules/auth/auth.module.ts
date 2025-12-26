import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { GoogleStrategy } from './strategy/google.strategy';
import { UserRole } from 'src/entities/user-role.entity';
import { ConfigModule } from '@nestjs/config';
import { MailService } from '../send-mail/sendmail.service';
import { SendMailModule } from '../send-mail/send-mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_LOGIN_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    SendMailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, MailService],
  exports: [AuthService],
})
export class AuthModule {}
