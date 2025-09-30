import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Brackets, EntityManager, Repository } from 'typeorm';
import * as crypto from 'crypto';
import { CreateUserDto } from './dto/create_user.dto';
import { GetUserDto } from './dto/get_user.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { UpdateUserDto } from './dto/update_user.dto';
import e from 'express';
import { UserRole } from 'src/entities/user-role.entity';
import { Multer } from 'multer';
import { CloudinaryService } from 'src/service/cloudinary.service';
import { LocationInfo } from 'src/entities/location-info.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
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

  async create(createUserDto: CreateUserDto, image?: Multer.File) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = this.hashPassword(createUserDto.password, salt);

    if (await this.userRepository.findOneBy({ email: createUserDto.email })) {
      throw new BadRequestException('Email already exists');
    }

    const role = await this.userRoleRepository.findOne({
      where: { id: createUserDto.roleId },
    });
    if (!role) throw new BadRequestException('Role not found');

    let locationInfo: LocationInfo | null = null;
    if (createUserDto.locationInfoId) {
      locationInfo = await this.entityManager.findOneBy(LocationInfo, {
        id: createUserDto.locationInfoId,
      });
      if (!locationInfo) {
        throw new BadRequestException('Location info not found');
      }
    }

    let avatarUrl: string | null = null;
    if (image) {
      avatarUrl = await this.cloudinaryService.uploadAndReturnImageUrl(image);
    }

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role,
      locationInfo,
      avatarUrl,
    });

    await this.entityManager.save(user);
    return { user, message: 'User created successfully' };
  }

  async getAll(params: GetUserDto): Promise<ResponsePaginate<User>> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.locationInfo', 'locationInfo')
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('user.createdAt', params.OrderSort);

    if (params.role) {
      query.andWhere('role.name = :role', { role: params.role });
    }

    if (params.search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('user.fullName ILIKE :search', {
            search: `%${params.search}%`,
          })
            .orWhere('user.email ILIKE :search', {
              search: `%${params.search}%`,
            })
            .orWhere('user.phone ILIKE :search', {
              search: `%${params.search}%`,
            });
        }),
      );
    }

    if (params.specialty) {
      query.andWhere(
        "COALESCE(CAST(user.specialties AS text), '') ILIKE :specialty",
        { specialty: `%${params.specialty}%` },
      );
    }

    if (params.locationInfoId) {
      query.andWhere('user.location_info_id = :locationInfoId', {
        locationInfoId: params.locationInfoId,
      });
    }

    const [result, total] = await query.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return { user, message: 'Success' };
  }

  async update(id: string, updateUserDto: UpdateUserDto, image?: Multer.File) {
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
          user.email = updateUserDto.email;
        }
      }
      if (updateUserDto.fullName) {
        user.fullName = updateUserDto.fullName;
      }
      if (updateUserDto.phone) {
        user.phone = updateUserDto.phone;
      }
      if (updateUserDto.roleId) {
        const role = await this.userRoleRepository.findOne({
          where: { id: updateUserDto.roleId },
        });
        if (!role) throw new BadRequestException('Role not found');
        user.role = role;
      }

      if (updateUserDto.locationInfoId) {
        const locationInfo = await this.entityManager.findOneBy(LocationInfo, {
          id: updateUserDto.locationInfoId,
        });
        if (!locationInfo) {
          throw new BadRequestException('Location info not found');
        }
        user.locationInfo = locationInfo;
      }
      if (image) {
        user.avatarUrl =
          await this.cloudinaryService.uploadAndReturnImageUrl(image);
      }
      if (updateUserDto.password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = this.hashPassword(updateUserDto.password, salt);
        user.password = hashedPassword;
      }

      if (updateUserDto.experienceYears !== undefined) {
        user.experienceYears = updateUserDto.experienceYears;
      }
      if (updateUserDto.specialties) {
        user.specialties = updateUserDto.specialties;
      }
      if (updateUserDto.languages) {
        user.languages = updateUserDto.languages;
      }
      if (updateUserDto.certifications) {
        user.certifications = updateUserDto.certifications;
      }
    }
    return await this.entityManager.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  async requestIsFromBank(id: string, image?: Multer.File, note?: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new BadRequestException('User not found');

    const fromBank = user.fromBank || { isFromBank: false, requested: false };

    if (fromBank.isFromBank) {
      throw new BadRequestException('User is already marked as from bank');
    }
    if (fromBank.requested) {
      throw new BadRequestException('User already has a pending request');
    }

    let imageUrl: string | null = null;
    if (image) {
      imageUrl = await this.cloudinaryService.uploadAndReturnImageUrl(image);
    }

    user.fromBank = {
      ...fromBank,
      requested: true,
      imageUrl,
      note,
    };
    await this.entityManager.save(user);

    return { message: 'Request to be from bank submitted successfully', user };
  }

  async approveIsFromBank(id: string, approve: boolean) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new BadRequestException('User not found');

    const fromBank = user.fromBank || { isFromBank: false, requested: false };

    if (!fromBank.requested) {
      throw new BadRequestException('No request pending for this user');
    }

    user.fromBank = {
      ...fromBank,
      isFromBank: approve,
      requested: false,
      note: approve ? 'Approved by admin' : 'Rejected by admin',
    };

    await this.entityManager.save(user);

    return {
      message: `User ${user.fullName} has been ${approve ? 'approved' : 'rejected'} as from bank`,
      user,
    };
  }

  async getBankRequests(params: GetUserDto) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where(`"user"."fromBank"->>'requested' = :requested`, {
        requested: 'true',
      })
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('user.createdAt', params.OrderSort);

    if (params.search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('user.fullName ILIKE :search', {
            search: `%${params.search}%`,
          })
            .orWhere('user.email ILIKE :search', {
              search: `%${params.search}%`,
            })
            .orWhere('user.phone ILIKE :search', {
              search: `%${params.search}%`,
            });
        }),
      );
    }

    if (params.role) {
      query.andWhere('role.name = :role', { role: params.role });
    }

    const [result, total] = await query
      .skip(params.skip)
      .take(params.perPage)
      .getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }
}
