import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from 'src/entities/property.entity';
import { EntityManager, Repository } from 'typeorm';
import { GetPropertiesFilterDto } from './dto/get_property.dto';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { CreatePropertyDto } from './dto/create_property.dto';
import { UpdatePropertyDto } from './dto/update_property.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createPropertyDto: CreatePropertyDto) {
    const user = await this.entityManager.findOneBy(User, {
      id: createPropertyDto.user_id,
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { user_id, ...propertyData } = createPropertyDto;

    const property = this.propertyRepository.create({
      owner: user,
      ...propertyData,
    });

    await this.entityManager.save(property);
    return { property, message: 'Property created successfully' };
  }
  async getAll(params: GetPropertiesFilterDto) {
    const properties = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.owner', 'owner')
      .skip(params.skip)
      .take(params.take)
      .orderBy('property.createdAt', params.OrderSort);

    if (params.type) {
      properties.andWhere('property.type = :type', { type: params.type });
    }

    if (params.keyword) {
      properties.andWhere(
        '(property.title ILIKE :keyword OR property.description ILIKE :keyword)',
        { keyword: `%${params.keyword}%` },
      );
    }
    if (params.minPrice) {
      properties.andWhere('property.price >= :minPrice', {
        minPrice: params.minPrice,
      });
    }
    if (params.maxPrice) {
      properties.andWhere('property.price <= :maxPrice', {
        maxPrice: params.maxPrice,
      });
    }

    if (params.minArea) {
      properties.andWhere('property.area >= :minArea', {
        minArea: params.minArea,
      });
    }
    if (params.maxArea) {
      properties.andWhere('property.area <= :maxArea', {
        maxArea: params.maxArea,
      });
    }
    if (params.bedrooms !== undefined) {
      properties.andWhere('property.bedrooms = :bedrooms', {
        bedrooms: params.bedrooms,
      });
    }
    if (params.bathrooms !== undefined) {
      properties.andWhere('property.bathrooms = :bathrooms', {
        bathrooms: params.bathrooms,
      });
    }

    if (params.isVerified !== undefined) {
      properties.andWhere('property.isVerified = :isVerified', {
        isVerified: params.isVerified,
      });
    }

    const [result, total] = await properties.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id: string) {
    const property = await this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.owner', 'owner')
      .where('property.id = :id', { id })
      .getOne();
    if (!property) {
      throw new BadRequestException('Property not found');
    }
    return { property, message: 'Success' };
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    const properties = await this.propertyRepository.findOneBy({ id });
    if (!properties) {
      throw new NotFoundException('Property not found');
    }

    Object.assign(properties, updatePropertyDto);
    await this.entityManager.save(properties);
    return { properties, message: 'Property updated successfully' };
  }

  async remove(id: string) {
    const property = await this.propertyRepository.findOne({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Tour not found');
    }
    await this.entityManager.remove(property);
    return { message: 'Property deleted successfully' };
  }
}
