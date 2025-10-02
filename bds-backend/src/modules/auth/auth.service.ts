import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as crypto from 'crypto';
import { RoleEnum } from 'src/common/enum/enum';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Profile } from 'passport-google-oauth20';
import { UserRole } from 'src/entities/user-role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async register(registerDto: RegisterDto) {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordClean = registerDto.password.trim();
    const hashedPassword = this.hashPassword(passwordClean, salt);

    if (
      await this.userRepository.findOne({ where: { email: registerDto.email } })
    ) {
      throw new BadRequestException('Email already exists');
    }

    const defaultRole = await this.userRoleRepository.findOne({
      where: { name: 'User' },
    });
    if (!defaultRole) {
      throw new BadRequestException('Default role not found');
    }

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      role: defaultRole,
    });
    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['role'],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const [storedHash, storedSalt] = user.password.split('.');
    const inputHash = crypto
      .pbkdf2Sync(loginDto.password.trim(), storedSalt, 10000, 64, 'sha512')
      .toString('hex');

    if (storedHash !== inputHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role.name,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_LOGIN_SECRET,
      expiresIn: '7d',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return { access_token, refresh_token };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['role'],
      });

      if (!user) throw new UnauthorizedException('User not found');

      const newPayload = {
        sub: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role.name,
      };

      const newAccessToken = await this.jwtService.signAsync(newPayload, {
        secret: process.env.JWT_LOGIN_SECRET,
        expiresIn: '7d',
      });

      return { access_token: newAccessToken };
    } catch {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }

  hashPassword(password: string, salt: string): string {
    if (!password || !salt) {
      throw new Error('Password and salt are required for hashing');
    }
    const hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
    return `${hash}.${salt}`;
  }

  async validateUserFromToken(token: string): Promise<User> {
    try {
      const decodedToken = this.jwtService.verify(token);

      if (!decodedToken || !decodedToken.id) {
        throw new UnauthorizedException('Invalid token');
      }
      const user = await this.userRepository.findOne({
        where: { id: decodedToken.id },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      throw error;
    }
  }

  async validateUserFromGoogle(
    profile: Profile,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { emails, displayName } = profile;
    const salt = crypto.randomBytes(16).toString('hex');
    const email = emails[0].value;
    const passwordClean = '123456789'.trim();
    const hashedPassword = this.hashPassword(passwordClean, salt);

    let user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) {
      const defaultRole = await this.userRoleRepository.findOne({
        where: { name: 'User' },
      });
      if (!defaultRole) throw new BadRequestException('Default role not found');
      user = this.userRepository.create({
        email,
        fullName: displayName,
        avatarUrl:
          'https://res.cloudinary.com/ds7udoemg/image/upload/v1732779178/lufyvfdbb24zhtloali7.png',
        password: hashedPassword,
        role: defaultRole,
      });

      user = await this.userRepository.save(user);
    }

    const payload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role.name,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_LOGIN_SECRET,
      expiresIn: '2h',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async resetPassword(email: string, newPassword: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }
    const salt = crypto.randomBytes(16).toString('hex');

    const hashedPassword = this.hashPassword(newPassword.trim(), salt);

    user.password = hashedPassword;
    await this.userRepository.save(user);

    return user;
  }
}
