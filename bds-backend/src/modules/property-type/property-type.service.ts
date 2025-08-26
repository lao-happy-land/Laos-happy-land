import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyType } from 'src/entities/property-type.entity';
import { Repository } from 'typeorm';
import { CreatePropertyTypeDto } from './dto/create_property_type.dto';
import { GetPropertyTypeDto } from './dto/get_property_type.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';

@Injectable()
export class PropertyTypeService {
  constructor(
    @InjectRepository(PropertyType)
    private readonly propertyTypeRepository: Repository<PropertyType>,
  ) {}

  async create(createPropertyTypeDto: CreatePropertyTypeDto) {
    const propertyType = this.propertyTypeRepository.create(
      createPropertyTypeDto,
    );
    await this.propertyTypeRepository.save(propertyType);
    return { propertyType, message: 'Property type created successfully' };
  }

  async getAll(params: GetPropertyTypeDto) {
    const propertyTypes = this.propertyTypeRepository
      .createQueryBuilder('propertyType')
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('propertyType.createdAt', params.OrderSort);
    const [result, total] = await propertyTypes.getManyAndCount();
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
    if (propertyType) {
      if (updatePropertyTypeDto.name) {
        if (
          await this.propertyTypeRepository.findOneBy({
            name: updatePropertyTypeDto.name,
          })
        ) {
          throw new BadRequestException('Property type name already exists');
        } else {
          propertyType.name = updatePropertyTypeDto.name;
        }
      }
    }
    await this.propertyTypeRepository.save(propertyType);
    return { propertyType, message: 'Property type updated successfully' };
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
