import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { PropertyType } from 'src/entities/property-type.entity';
import { TranslateService } from 'src/service/translate.service';
import { EntityManager, Repository } from 'typeorm';
import { CreatePropertyTypeDto } from './dto/create_property_type.dto';
import { GetPropertyTypeDto } from './dto/get_property_type.dto';
import { GetOnePropertyTypeDto } from './dto/get_property_type_id.dto';

@Injectable()
export class PropertyTypeService {
  constructor(
    @InjectRepository(PropertyType)
    private readonly propertyTypeRepository: Repository<PropertyType>,
    private readonly translateService: TranslateService,
    private readonly entityManager: EntityManager,
  ) {}

  private mapLang(param?: string): 'vi' | 'en' | 'lo' {
    switch (param?.toUpperCase()) {
      case 'USD':
        return 'en';
      case 'LAK':
        return 'lo';
      case 'VND':
      default:
        return 'vi';
    }
  }

  private async generateTranslations(propertyType: PropertyType) {
    const languages: Array<'vi' | 'en' | 'lo'> = ['vi', 'en', 'lo'];
    const result: Record<string, { name: string | null }> = {};

    for (const lang of languages) {
      result[lang] = {
        name: propertyType.name
          ? await this.translateService.translateText(propertyType.name, lang)
          : null,
      };
    }

    propertyType.translatedContent = result;
  }

  private async saveTranslations(propertyType: PropertyType) {
    await this.generateTranslations(propertyType);
    await this.entityManager.save(propertyType);
  }

  private pickTranslation(
    propertyType: PropertyType,
    lang: 'vi' | 'en' | 'lo',
  ) {
    return (
      propertyType.translatedContent?.[lang] ??
      propertyType.translatedContent?.['vi'] ?? { name: propertyType.name }
    );
  }

  private applyTranslation(
    propertyType: PropertyType,
    lang: 'vi' | 'en' | 'lo',
  ) {
    const tr = this.pickTranslation(propertyType, lang);
    return {
      ...propertyType,
      name: tr.name,
      translatedContent: propertyType.translatedContent,
    };
  }

  async create(createDto: CreatePropertyTypeDto) {
    let propertyType = this.propertyTypeRepository.create(createDto);
    await this.saveTranslations(propertyType);

    const tr = this.pickTranslation(propertyType, 'vi');

    return {
      propertyType: {
        ...propertyType,
        name: tr.name,
        translatedContent: propertyType.translatedContent,
      },
      message: 'Property type created successfully',
    };
  }

  async getAll(params: GetPropertyTypeDto) {
    const query = this.propertyTypeRepository
      .createQueryBuilder('propertyType')
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('propertyType.createdAt', params.OrderSort);

    if (params.search) {
      query.andWhere('propertyType.name ILIKE :search', {
        search: `%${params.search}%`,
      });
    }

    if (params.transaction) {
      query.andWhere('propertyType.transactionType = :transaction', {
        transaction: params.transaction,
      });
    }

    const [result, total] = await query.getManyAndCount();
    const targetLang = this.mapLang(params.lang);

    const translated = result.map((item) =>
      this.applyTranslation(item, targetLang),
    );

    const pageMeta = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(translated, pageMeta, 'Success');
  }

  async get(id: string, params: GetOnePropertyTypeDto) {
    const propertyType = await this.propertyTypeRepository.findOneBy({ id });
    if (!propertyType) throw new BadRequestException('Property type not found');

    const targetLang = this.mapLang(params.lang);
    const tr = this.pickTranslation(propertyType, targetLang);

    return {
      propertyType: {
        ...propertyType,
        name: tr.name,
        translatedContent: propertyType.translatedContent,
      },
      message: 'Success',
    };
  }

  async update(id: string, updateDto: CreatePropertyTypeDto) {
    const propertyType = await this.propertyTypeRepository.findOneBy({ id });
    if (!propertyType) throw new BadRequestException('Property type not found');

    let needsTranslate = false;

    if (updateDto.name && updateDto.name !== propertyType.name) {
      const existed = await this.propertyTypeRepository.findOneBy({
        name: updateDto.name,
      });
      if (existed && existed.id !== id) {
        throw new BadRequestException('Property type name already exists');
      }
      propertyType.name = updateDto.name;
      needsTranslate = true;
    }

    if (updateDto.transactionType) {
      propertyType.transactionType = updateDto.transactionType;
    }

    if (needsTranslate) {
      await this.saveTranslations(propertyType);
    } else {
      await this.entityManager.save(propertyType);
    }

    const tr = this.pickTranslation(propertyType, 'vi');

    return {
      propertyType: {
        ...propertyType,
        name: tr.name,
        translatedContent: propertyType.translatedContent,
      },
      message: 'Property type updated successfully',
    };
  }

  async remove(id: string) {
    const propertyType = await this.propertyTypeRepository.findOneBy({ id });
    if (!propertyType) throw new BadRequestException('Property type not found');

    await this.entityManager.remove(propertyType);

    return { message: 'Property type deleted successfully' };
  }
}
