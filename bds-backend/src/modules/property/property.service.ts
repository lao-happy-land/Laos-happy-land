import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceHistoryEntry, Property } from 'src/entities/property.entity';
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
import { PropertyStatusEnum, TransactionEnum } from 'src/common/enum/enum';
import { RejectPropertyDto } from './dto/reject_property.dto';
import { ExchangeRateService } from '../exchange-rate/exchange-rate.service';
import { LocationInfo } from 'src/entities/location-info.entity';
import { GetPropertyDetailDto } from './dto/get_property_id.dto';
import { GetPropertyByUserDto } from './dto/get_property_by_user.dto';
import { instanceToPlain } from 'class-transformer';
import { TranslateService } from 'src/service/translate.service';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly translateService: TranslateService,
    private readonly entityManager: EntityManager,
  ) {}

  private async saveTranslations(property: Property) {
    const langs = ['en', 'lo', 'vi'];
    const translatedContent: Record<string, any> = {};

    for (const lang of langs) {
      const translated = {
        title: property.title
          ? await this.translateService.translateText(property.title, lang)
          : null,
        description: property.description
          ? await this.translateService.translateText(
              property.description,
              lang,
            )
          : null,
        legalStatus: property.legalStatus
          ? await this.translateService.translateText(
              property.legalStatus,
              lang,
            )
          : null,
        details: property.details?.content
          ? await Promise.all(
              property.details.content.map(async (c) => ({
                ...c,
                value: c.value
                  ? await this.translateService.translateText(c.value, lang)
                  : c.value,
              })),
            )
          : null,
        typeName: property.type?.name
          ? await this.translateService.translateText(property.type.name, lang)
          : null,
        locationName: property.locationInfo?.name
          ? await this.translateService.translateText(
              property.locationInfo.name,
              lang,
            )
          : null,
        ownerRoleName: property.owner?.role?.name
          ? await this.translateService.translateText(
              property.owner.role.name,
              lang,
            )
          : null,
      };

      translatedContent[lang] = translated;
    }

    property.translatedContent = translatedContent;
    await this.propertyRepository.save(property);
  }

  async create(createPropertyDto: CreatePropertyDto, user?: any) {
    const isAdmin = !!user?.role && user.role.toString() === 'Admin';
    const isBroker = !!user?.role && user.role.toString() === 'Broker';
    const owner = await this.entityManager.findOne(User, {
      where: { id: user.sub },
      relations: ['role'],
    });

    const propertyType = await this.entityManager.findOneBy(PropertyType, {
      id: createPropertyDto.typeId,
    });
    if (!propertyType) {
      throw new BadRequestException('Property type not found');
    }

    const locationInfo = await this.entityManager.findOneBy(LocationInfo, {
      id: createPropertyDto.locationInfoId,
    });
    if (!locationInfo) {
      throw new BadRequestException('Location info not found');
    }

    const { typeId, locationInfoId, price, priceSource, ...propertyData } =
      createPropertyDto;

    if (typeof propertyData.details === 'string') {
      try {
        propertyData.details = JSON.parse(propertyData.details);
      } catch (e) {
        throw new BadRequestException('Invalid details format');
      }
    }

    const rates = await this.exchangeRateService.getRates();
    const finalPrice: Record<string, number> = {};
    const history: PriceHistoryEntry[] = [];

    const inputCurrency = (priceSource || 'USD').toUpperCase() as
      | 'USD'
      | 'LAK'
      | 'THB';
    const inputValue = Number(price);

    if (isNaN(inputValue)) throw new BadRequestException('Invalid price');

    let usdBase = inputValue;
    if (inputCurrency === 'LAK') usdBase = inputValue / rates['LAK'];
    else if (inputCurrency === 'THB') usdBase = inputValue / rates['THB'];
    const round = (val: number, digits = 0) => {
      const factor = Math.pow(10, digits);
      return Math.round(val * factor) / factor;
    };

    finalPrice['USD'] = round(usdBase);
    finalPrice['LAK'] = round(usdBase * rates['LAK']);
    finalPrice['THB'] = round(usdBase * rates['THB']);

    history.push({ rates: finalPrice, date: new Date().toISOString() });

    const property = this.propertyRepository.create({
      ...propertyData,
      price: finalPrice,
      priceHistory: history,
      owner,
      locationInfo,
      type: propertyType,
      status:
        isAdmin || isBroker
          ? PropertyStatusEnum.APPROVED
          : PropertyStatusEnum.PENDING,
    });

    await this.entityManager.save(property);
    await this.saveTranslations(property);

    return { property, message: 'Property created successfully' };
  }

  formatPrice(value: string | number | null): string | null {
    if (value === null || value === undefined) return null;
    return value.toString();
  }

  private formatProperty(
    item: Property,
    priceSource?: 'LAK' | 'USD' | 'THB',
  ): any {
    if (!priceSource) return item;
    const cur = priceSource;
    return {
      ...item,
      price: this.formatPrice(item.price?.[cur] ?? null),
      priceHistory: (item.priceHistory || []).map((ph) => ({
        date: ph.date,
        rates: this.formatPrice(ph.rates?.[cur] ?? null),
      })),
    };
  }

  private mapLang(param: string): string {
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

  private pickTranslatedContent(property: Property, lang: string) {
    if (!property.translatedContent) return property;

    const translated = property.translatedContent?.[lang] as {
      title?: string;
      description?: string;
      legalStatus?: string;
      details?: any;
      typeName?: string;
      locationName?: string;
      ownerRoleName?: string; // ✅ thêm
      owner?: {
        role?: {
          name?: string;
        };
      };
    };

    if (!translated) return property;

    const merged = {
      ...property,
      title: translated.title || property.title,
      description: translated.description || property.description,
      legalStatus: translated.legalStatus || property.legalStatus,
      details: translated.details || property.details,
    };

    // ✅ Merge type.name nếu có
    if (property.type) {
      merged.type = {
        ...property.type,
        name: translated.typeName || property.type.name,
      };
    }

    // ✅ Merge locationInfo.name nếu có
    if (property.locationInfo) {
      merged.locationInfo = {
        ...property.locationInfo,
        name: translated.locationName || property.locationInfo.name,
      };
    }

    // ✅ Merge owner.role.name nếu có
    if (property.owner && property.owner.role) {
      merged.owner = {
        ...property.owner,
        role: {
          ...property.owner.role,
          name: translated.ownerRoleName || property.owner.role.name,
        },
      } as User; // ép kiểu tránh lỗi thiếu field
    }

    delete (merged as any).translatedContent;

    return merged;
  }

  async getAll(params: GetPropertiesFilterDto, user: User) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const isAdmin = user?.role?.toString() === 'Admin';

    const properties = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.owner', 'owner')
      .leftJoinAndSelect('property.type', 'type')
      .leftJoinAndSelect('property.locationInfo', 'locationInfo')
      .addSelect(
        `CASE WHEN property."createdAt" >= :oneMonthAgo THEN 1 ELSE 0 END`,
        'recent',
      )
      .setParameter('oneMonthAgo', oneMonthAgo)
      .orderBy('recent', 'DESC')
      .addOrderBy('property.priority', 'DESC')
      .addOrderBy('property.viewsCount', 'DESC')
      .addOrderBy('property.createdAt', 'DESC');
    if (!isAdmin) {
      properties.andWhere('property.status = :status', {
        status: PropertyStatusEnum.APPROVED,
      });
    }

    if (params.type?.length) {
      properties.andWhere('type.id IN (:...types)', { types: params.type });
    }

    if (params.locationId) {
      properties.andWhere('locationInfo.id = :locationId', {
        locationId: params.locationId,
      });
      const location = await this.entityManager.findOne(LocationInfo, {
        where: { id: params.locationId },
      });
      if (location) {
        location.viewCount = (location.viewCount || 0) + 1;
        await this.entityManager.save(location);
      }
    }

    if (params.priceSource) {
      if (params.minPrice !== undefined) {
        properties.andWhere(
          `(property.price ->> :priceSource)::numeric >= :minPrice`,
          { priceSource: params.priceSource, minPrice: params.minPrice },
        );
      }
      if (params.maxPrice !== undefined) {
        properties.andWhere(
          `(property.price ->> :priceSource)::numeric <= :maxPrice`,
          { priceSource: params.priceSource, maxPrice: params.maxPrice },
        );
      }
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

    if (params.location) {
      properties.andWhere(
        `(property.location ->> 'address') ILIKE :location OR 
      property.location ->> 'city' ILIKE :location`,
        { location: `%${params.location}%` },
      );
    }

    if (params.transaction) {
      properties.andWhere('property.transactionType = :transactionType', {
        transactionType: params.transaction,
      });
    }

    if (params.status && user && user.role.toString() === 'Admin') {
      properties.andWhere('property.status = :status', {
        status: params.status,
      });
    }

    const allProperties = await properties.getMany();

    const targetLang = this.mapLang(params.currency || params.currency);

    let translated = allProperties.map((item) => {
      const formatted = params.priceSource
        ? this.formatProperty(item, params.priceSource)
        : item;
      return this.pickTranslatedContent(formatted, targetLang);
    });

    if (params.keyword) {
      const keywordLower = params.keyword.toLowerCase();
      translated = translated.filter(
        (item) =>
          item.title?.toLowerCase().includes(keywordLower) ||
          item.description?.toLowerCase().includes(keywordLower),
      );
    }

    const page = params.page || 1;
    const perPage = params.perPage || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    const paginatedResult = translated.slice(startIndex, endIndex);

    const pageMetaDto = new PageMetaDto({
      itemCount: translated.length,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(paginatedResult, pageMetaDto, 'Success');
  }

  async getSimilarProperties(propertyId: string, params: GetPropertyByUserDto) {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
      relations: ['type', 'locationInfo'],
    });

    if (!property) {
      throw new BadRequestException('Property not found');
    }

    const qb = this.propertyRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.type', 'type')
      .leftJoinAndSelect('p.locationInfo', 'locationInfo')
      .leftJoinAndSelect('p.owner', 'owner')
      .leftJoinAndSelect('owner.role', 'role')
      .where('p.id != :propertyId', { propertyId });

    if (property.type?.id) {
      qb.andWhere('type.id = :typeId', { typeId: property.type.id });
    }

    if (property.locationInfo?.id) {
      qb.andWhere('locationInfo.id = :locationId', {
        locationId: property.locationInfo.id,
      });
    }

    qb.skip(params.skip).take(params.perPage).orderBy('p.createdAt', 'DESC');

    const [result, total] = await qb.getManyAndCount();

    const targetLang = this.mapLang(params.currency);

    const finalResult = await Promise.all(
      result.map(async (item) => {
        const formatted = params.priceSource
          ? this.formatProperty(item, params.priceSource)
          : item;
        return this.pickTranslatedContent(formatted, targetLang);
      }),
    );
    const serializedResult = instanceToPlain(finalResult);

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(
      serializedResult as any,
      pageMetaDto,
      'Success',
    );
  }

  async get(id: string, params: GetPropertyDetailDto) {
    const qb = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.owner', 'owner')
      .leftJoinAndSelect('owner.role', 'role')
      .leftJoinAndSelect('property.type', 'type')
      .leftJoinAndSelect('property.locationInfo', 'locationInfo')
      .where('property.id = :id', { id });

    const property = await qb.getOne();
    if (!property) {
      throw new BadRequestException('Property not found');
    }

    property.viewsCount = (property.viewsCount || 0) + 1;
    await this.propertyRepository.save(property);
    if (property.locationInfo?.id) {
      const location = await this.entityManager.findOne(LocationInfo, {
        where: { id: property.locationInfo.id },
      });
      if (location) {
        location.viewCount = (location.viewCount || 0) + 1;
        await this.entityManager.save(location);
      }
    }

    const targetLang = this.mapLang(params.currency);
    const formattedProperty = params.priceSource
      ? this.formatProperty(property, params.priceSource)
      : property;
    const translatedProperty = await this.pickTranslatedContent(
      formattedProperty,
      targetLang,
    );
    const serializedProperty = instanceToPlain(translatedProperty);

    return {
      property: serializedProperty,
      message: 'Success',
    };
  }

  async getByUser(params: GetPropertyByUserDto, user: any) {
    const owner = await this.entityManager.findOneBy(User, { id: user.sub });
    const userId = owner.id;

    const qb = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.type', 'type')
      .leftJoinAndSelect('property.locationInfo', 'locationInfo')
      .leftJoinAndSelect('property.owner', 'owner')
      .leftJoinAndSelect('owner.role', 'role')
      .where('property.owner_id = :userId', { userId })
      .orderBy('property.createdAt', 'DESC')
      .skip(params.skip)
      .take(params.perPage);

    const [properties, total] = await qb.getManyAndCount();

    const targetLang = this.mapLang(params.currency);

    const finalResult = await Promise.all(
      properties.map(async (item) => {
        const formatted = params.priceSource
          ? this.formatProperty(item, params.priceSource)
          : item;
        return this.pickTranslatedContent(formatted, targetLang);
      }),
    );
    const serializedResult = instanceToPlain(finalResult);

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(
      serializedResult as any,
      pageMetaDto,
      'Success',
    );
  }

  async getByUserId(userId: string, params: GetPropertyByUserDto) {
    const qb = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.type', 'type')
      .leftJoinAndSelect('property.owner', 'owner')
      .leftJoinAndSelect('owner.role', 'role')
      .leftJoinAndSelect('property.locationInfo', 'locationInfo')
      .where('property.owner_id = :userId', { userId })
      .orderBy('property.createdAt', 'DESC')
      .skip(params.skip)
      .take(params.perPage);

    const [properties, total] = await qb.getManyAndCount();

    const targetLang = this.mapLang(params.currency);

    const finalResult = await Promise.all(
      properties.map(async (item) => {
        const formatted = params.priceSource
          ? this.formatProperty(item, params.priceSource)
          : item;
        return this.pickTranslatedContent(formatted, targetLang);
      }),
    );

    const serializedResult = instanceToPlain(finalResult);

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(
      serializedResult as any,
      pageMetaDto,
      'Success',
    );
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['owner', 'type', 'locationInfo'],
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }
    if (updatePropertyDto.locationInfoId) {
      const locationInfo = await this.entityManager.findOneBy(LocationInfo, {
        id: updatePropertyDto.locationInfoId,
      });
      if (!locationInfo) {
        throw new BadRequestException('Location info not found');
      }
      property.locationInfo = locationInfo;
    }

    if (updatePropertyDto.location) {
      if (typeof updatePropertyDto.location === 'string') {
        try {
          updatePropertyDto.location = JSON.parse(updatePropertyDto.location);
        } catch (e) {
          throw new BadRequestException('Invalid location format');
        }
      }
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

    if (updatePropertyDto.location) {
      if (typeof updatePropertyDto.location === 'string') {
        try {
          updatePropertyDto.location = JSON.parse(updatePropertyDto.location);
        } catch (e) {
          throw new BadRequestException('Invalid location format');
        }
      }
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

    const { price, priceSource } = updatePropertyDto;
    if (price !== undefined && price !== null) {
      const rates = await this.exchangeRateService.getRates();

      const inputCurrency = (priceSource || 'USD').toUpperCase() as
        | 'USD'
        | 'LAK'
        | 'THB';
      const inputValue = Number(price);
      if (isNaN(inputValue)) throw new BadRequestException('Invalid price');

      let usdBase = inputValue;
      if (inputCurrency === 'LAK') usdBase = inputValue / rates['LAK'];
      else if (inputCurrency === 'THB') usdBase = inputValue / rates['THB'];

      const round = (val: number, digits = 0) => {
        const factor = Math.pow(10, digits);
        return Math.round(val * factor) / factor;
      };

      const finalPrice: Record<string, number> = {
        USD: round(usdBase),
        LAK: round(usdBase * rates['LAK']),
        THB: round(usdBase * rates['THB']),
      };

      const currentPrice = property.price || {};
      const isPriceChanged = ['USD', 'LAK', 'THB'].some(
        (cur) => currentPrice[cur] !== finalPrice[cur],
      );

      if (isPriceChanged) {
        property.price = finalPrice;
        property.priceHistory = [
          ...(property.priceHistory || []),
          { rates: finalPrice, date: new Date().toISOString() },
        ];
      }
    }

    Object.assign(property, {
      ...updatePropertyDto,
      typeId: undefined,
      price: property.price,
    });

    await this.entityManager.save(property);
    await this.saveTranslations(property);
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
