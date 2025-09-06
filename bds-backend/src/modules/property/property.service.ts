import {
  BadRequestException,
  ForbiddenException,
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
import { Multer } from 'multer';
import { CloudinaryService } from 'src/service/cloudinary.service';
import { PropertyType } from 'src/entities/property-type.entity';
import { PageOptionsDto } from 'src/common/dtos/pageOption';
import { PropertyStatusEnum } from 'src/common/enum/enum';
import { RejectPropertyDto } from './dto/reject_property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly entityManager: EntityManager,
  ) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    mainImage?: Multer.File,
    images?: File[],
    user?: any,
  ) {
    const isAdmin = !!user?.role && user.role.toString() === 'Admin';
    const owner = await this.entityManager.findOneBy(User, {
      id: user.sub,
    });

    const propertyType = await this.entityManager.findOneBy(PropertyType, {
      id: createPropertyDto.typeId,
    });
    if (!propertyType) {
      throw new BadRequestException('Property type not found');
    }

    const { typeId, ...propertyData } = createPropertyDto;

    if (typeof propertyData.details === 'string') {
      try {
        propertyData.details = JSON.parse(propertyData.details);
      } catch (e) {
        throw new BadRequestException('Invalid details format');
      }
    }

    if (mainImage) {
      propertyData.mainImage =
        await this.cloudinaryService.uploadAndReturnImageUrl(mainImage);
    }

    if (images && images.length > 0) {
      propertyData.images = await Promise.all(
        images.map(async (file) => {
          return await this.cloudinaryService.uploadAndReturnImageUrl(file);
        }),
      );
    } else {
      propertyData.images = null;
    }

    if (propertyData.price) {
      propertyData.priceHistory = [
        {
          price: propertyData.price,
          date: new Date().toISOString(),
        },
      ];
    }

    const property = this.propertyRepository.create({
      ...propertyData,
      owner: owner,
      type: propertyType,
      status: isAdmin
        ? PropertyStatusEnum.APPROVED
        : PropertyStatusEnum.PENDING,
    });

    await this.entityManager.save(property);

    return { property, message: 'Property created successfully' };
  }

  async getAll(params: GetPropertiesFilterDto, user: User) {
    const isAdmin = !!user?.role && user.role.toString() === 'Admin';

    const properties = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.owner', 'owner')
      .leftJoinAndSelect('property.type', 'type')
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('property.createdAt', params.OrderSort);

    if (!isAdmin) {
      properties.andWhere('property.status = :status', {
        status: PropertyStatusEnum.APPROVED,
      });
    }

    if (params.type) {
      properties.andWhere('type.id = :type', { type: params.type });
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
      properties.andWhere(`(property.details ->> 'area')::float >= :minArea`, {
        minArea: params.minArea,
      });
    }
    if (params.maxArea) {
      properties.andWhere(`(property.details ->> 'area')::float <= :maxArea`, {
        maxArea: params.maxArea,
      });
    }

    if (params.bedrooms !== undefined) {
      properties.andWhere(
        `(property.details ->> 'bedrooms')::int = :bedrooms`,
        {
          bedrooms: params.bedrooms,
        },
      );
    }

    if (params.bathrooms !== undefined) {
      properties.andWhere(
        `(property.details ->> 'bathrooms')::int = :bathrooms`,
        {
          bathrooms: params.bathrooms,
        },
      );
    }

    if (params.isVerified !== undefined) {
      properties.andWhere('property.isVerified = :isVerified', {
        isVerified: params.isVerified,
      });
    }

    if (params.location) {
      properties.andWhere('property.location ILIKE :location', {
        location: `%${params.location}%`,
      });
    }

    if (params.transaction) {
      properties.andWhere('property.transactionType = :transactionType', {
        transactionType: params.transaction,
      });
    }

    if (params.status && user.role.toString() === 'Admin') {
      properties.andWhere('property.status = :status', {
        status: params.status,
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
      .leftJoinAndSelect('property.type', 'type')
      .where('property.id = :id', { id })
      .getOne();
    if (!property) {
      throw new BadRequestException('Property not found');
    }

    property.viewsCount = (property.viewsCount || 0) + 1;
    await this.propertyRepository.save(property);
    return { property, message: 'Success' };
  }

  async getByUser(params: PageOptionsDto, user: any) {
    const owner = await this.entityManager.findOneBy(User, {
      id: user.sub,
    });
    const userId = owner.id;

    const queryBuilder = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.type', 'type')
      .where('property.owner_id = :userId', { userId })
      .orderBy('property.createdAt', 'DESC')
      .skip(params.skip)
      .take(params.perPage);

    const [properties, total] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(properties, pageMetaDto, 'Success');
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    mainImage?: Multer.File,
    images?: Multer.File[],
  ) {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['owner', 'type'],
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (updatePropertyDto.typeId) {
      const propertyType = await this.entityManager.findOneBy(PropertyType, {
        id: updatePropertyDto.typeId,
      });
      if (!propertyType) {
        throw new BadRequestException('Property type not found');
      }
      property.type = propertyType;
    }

    if (updatePropertyDto.details) {
      if (typeof updatePropertyDto.details === 'string') {
        try {
          updatePropertyDto.details = JSON.parse(updatePropertyDto.details);
        } catch (e) {
          throw new BadRequestException('Invalid details format');
        }
      }
    }

    if (mainImage) {
      property.mainImage =
        await this.cloudinaryService.uploadAndReturnImageUrl(mainImage);
    }

    if (images && images.length > 0) {
      const imageUrls = await Promise.all(
        images.map(async (file) => {
          return await this.cloudinaryService.uploadAndReturnImageUrl(file);
        }),
      );
      property.images = imageUrls;
    }

    if (
      updatePropertyDto.price !== undefined &&
      updatePropertyDto.price !== null
    ) {
      const newPrice = Number(updatePropertyDto.price);
      const currentPrice = Number(property.price);

      if (!isNaN(newPrice) && newPrice !== currentPrice) {
        const history = property.priceHistory || [];
        const lastPrice =
          history.length > 0 ? Number(history[history.length - 1].price) : null;

        if (lastPrice !== newPrice) {
          history.push({
            price: newPrice,
            date: new Date().toISOString(),
          });
          property.priceHistory = history;
        }
      }
    }

    Object.assign(property, {
      ...updatePropertyDto,
      typeId: undefined,
    });

    await this.entityManager.save(property);
    return { property, message: 'Property updated successfully' };
  }

  async remove(id: string, user: any) {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }
    const isAdmin = user?.role?.toString() === 'Admin';
    const isOwner = property.owner?.id === user?.sub;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'You are not allowed to delete this property',
      );
    }

    await this.entityManager.remove(property);
    return { message: 'Property deleted successfully' };
  }

  async approveProperty(id: string) {
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (!property) throw new NotFoundException('Property not found');

    property.status = PropertyStatusEnum.APPROVED;
    await this.propertyRepository.save(property);
    return { property, message: 'Property approved successfully' };
  }

  async rejectProperty(id: string, rejectPropertyDto: RejectPropertyDto) {
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (!property) throw new NotFoundException('Property not found');

    property.status = PropertyStatusEnum.REJECTED;
    if (rejectPropertyDto.reason) {
      property.reason = rejectPropertyDto.reason;
    }

    await this.propertyRepository.save(property);
    return { property, message: 'Property rejected successfully' };
  }
}
