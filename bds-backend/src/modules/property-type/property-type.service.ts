import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyType } from 'src/entities/property-type.entity';
import { Repository } from 'typeorm';
import { CreatePropertyTypeDto } from './dto/create_property_type.dto';
import { GetPropertyTypeDto } from './dto/get_property_type.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate, ResponsePaginateObject } from 'src/common/dtos/reponsePaginate';

@Injectable()
export class PropertyTypeService {
  constructor(
    @InjectRepository(PropertyType)
    private readonly propertyTypeRepository: Repository<PropertyType>,
  ) {}

  async create(createPropertyTypeDto: CreatePropertyTypeDto) {
    const { name } = createPropertyTypeDto;

    if (!name) {
      throw new BadRequestException('Name is required');
    }

    const existed = await this.propertyTypeRepository.findOneBy({ name });
    if (existed) {
      throw new BadRequestException('Property type name already exists');
    }

    const propertyType = this.propertyTypeRepository.create(
      createPropertyTypeDto,
    );
    await this.propertyTypeRepository.save(propertyType);

    return { propertyType, message: 'Property type created successfully' };
  }

  async getAll(params: GetPropertyTypeDto) {
    const queryBuilder = this.propertyTypeRepository
      .createQueryBuilder('propertyType')
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('propertyType.createdAt', params.OrderSort);

    if(params.transaction){
      queryBuilder.andWhere('propertyType.transactionType = :transaction', { transaction: params.transaction });
    }

    const [result, total] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id: string) {
    const propertyType = await this.propertyTypeRepository
      .createQueryBuilder('propertyType')
      .where('propertyType.id = :id', { id })
      .getOne();
    if (!propertyType) {
      throw new BadRequestException('Property type not found');
    }
    return { propertyType, message: 'Success' };
  }

  async update(id: string, updatePropertyTypeDto: CreatePropertyTypeDto) {
    const propertyType = await this.propertyTypeRepository.findOneBy({ id });
    if (!propertyType) {
      throw new BadRequestException('Property type not found');
    }

    if (updatePropertyTypeDto.name) {
      const existed = await this.propertyTypeRepository.findOneBy({
        name: updatePropertyTypeDto.name,
      });

      if (existed && existed.id !== id) {
        throw new BadRequestException('Property type name already exists');
      }

      propertyType.name = updatePropertyTypeDto.name;
    }

    if (updatePropertyTypeDto.transactionType) {
      propertyType.transactionType = updatePropertyTypeDto.transactionType;
    }

    await this.propertyTypeRepository.save(propertyType);

    return {
      propertyType,
      message: 'Property type updated successfully',
    };
  }

  async remove(id: string) {
    const propertyType = await this.propertyTypeRepository.findOneBy({ id });
    if (!propertyType) {
      throw new BadRequestException('Property type not found');
    }
    await this.propertyTypeRepository.remove(propertyType);
    return { message: 'Property type deleted successfully' };
  }
}
