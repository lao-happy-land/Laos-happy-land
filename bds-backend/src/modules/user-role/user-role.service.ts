import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/entities/user-role.entity';
import { Repository } from 'typeorm';
import { CreateUserRoleDto } from './dto/create_user_role.dto';
import { GetUserRoleDto } from './dto/get_user_role.dto';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { PageMetaDto } from 'src/common/dtos/pageMeta';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async create(createUserRoleDto: CreateUserRoleDto) {
    const userRole = this.userRoleRepository.create(createUserRoleDto);
    await this.userRoleRepository.save(userRole);
    return { userRole, message: 'User role created successfully' };
  }

  async getAll(params: GetUserRoleDto) {
    const userRoles = this.userRoleRepository
      .createQueryBuilder('userRole')
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('userRole.createdAt', params.OrderSort);
    const [result, total] = await userRoles.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id: string) {
    const userRole = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .where('userRole.id = :id', { id })
      .getOne();
    if (!userRole) {
      throw new BadRequestException('User role not found');
    }
    return { userRole, message: 'Success' };
  }

  async update(id: string, updateUserRoleDto: CreateUserRoleDto) {
    const userRole = await this.userRoleRepository.findOneBy({ id });
    if (!userRole) {
      throw new BadRequestException('User role not found');
    }
    if (userRole) {
      if (updateUserRoleDto.name) {
        if (
          await this.userRoleRepository.findOneBy({
            name: updateUserRoleDto.name,
          })
        ) {
          throw new BadRequestException('User role name already exists');
        } else {
          userRole.name = updateUserRoleDto.name;
        }
      }
    }
    await this.userRoleRepository.save(userRole);
    return { userRole, message: 'User role updated successfully' };
  }

  async remove(id: string) {
    const userRole = await this.userRoleRepository.findOneBy({ id });
    if (!userRole) {
      throw new BadRequestException('User role not found');
    }
    await this.userRoleRepository.remove(userRole);
    return { message: 'User role deleted successfully' };
  }
}
