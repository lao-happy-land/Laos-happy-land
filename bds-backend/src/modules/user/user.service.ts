import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import * as crypto from 'crypto';
import { CreateUserDto } from './dto/create_user.dto';
import { GetUserDto } from './dto/get_user.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { UpdateUserDto } from './dto/update_user.dto';
import e from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  hashPassword(password: string, salt: string): string {
    if (!password || !salt) {
      throw new Error('Password and salt are required for hashing');
    }
    const hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
    return `${hash}.${salt}`;
  }

  async create(createUserDto: CreateUserDto) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = this.hashPassword(createUserDto.password, salt);
    if (await this.userRepository.findOneBy({ email: createUserDto.email })) {
      throw new BadRequestException('Email already exists');
    }
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    await this.entityManager.save(user);
    return { user, message: 'User created successfully' };
  }

  async getAll(params: GetUserDto) {
    const users = this.userRepository
      .createQueryBuilder('user')
      .skip(params.skip)
      .take(params.take)
      .orderBy('user.createdAt', params.OrderSort);

    if (params.fullName) {
      users.andWhere('user.fullName LIKE :fullName', {
        fullName: `%${params.fullName}%`,
      });
    }

    if (params.role) {
      users.andWhere('user.role = :role', { role: params.role });
    }

    const [result, total] = await users.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return { user, message: 'Success' };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user) {
        if (updateUserDto.email) {
            if (
                await this.userRepository.findOneBy({ email: updateUserDto.email })
            ) {
                throw new BadRequestException('Email already exists');
            } else {
                user.email = updateUserDto.email
            }
        }
        if (updateUserDto.fullName) {
            user.fullName = updateUserDto.fullName
        }
        if (updateUserDto.phone) {
            user.phone = updateUserDto.phone
        }
        if (updateUserDto.role) {
            user.role = updateUserDto.role
        }
        if (updateUserDto.avatarUrl) {
            user.avatarUrl = updateUserDto.avatarUrl
        }
        if (updateUserDto.password) {
            const salt = crypto.randomBytes(16).toString('hex');
            const hashedPassword = this.hashPassword(updateUserDto.password, salt);
            user.password = hashedPassword
        }
    }
    return await this.entityManager.save(user);
  }

  async remove(id:string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }
}
