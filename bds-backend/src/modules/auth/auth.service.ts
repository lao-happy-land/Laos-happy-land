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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
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

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      role: RoleEnum.USER,
    });
    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });
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
      fullname: user.fullName,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
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
}
