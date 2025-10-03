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

  async create(createPropertyDto: CreatePropertyDto, user?: any) {
    const isAdmin = !!user?.role && user.role.toString() === 'Admin';
    const isBroker = !!user?.role && user.role.toString() === 'Broker';
    const owner = await this.entityManager.findOneBy(User, { id: user.sub });

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

    const {
      typeId,
      locationInfoId,
      price: usdPrice,
      ...propertyData
    } = createPropertyDto;

    if (typeof propertyData.details === 'string') {
      try {
        propertyData.details = JSON.parse(propertyData.details);
      } catch (e) {
        throw new BadRequestException('Invalid details format');
      }
    }

    let finalPrice: Record<string, number> = null;
    let history: PriceHistoryEntry[] = [];

    if (usdPrice !== undefined && usdPrice !== null) {
      const rates = await this.exchangeRateService.getRates();
      finalPrice = {};
      finalPrice['USD'] = usdPrice;

      Object.entries(rates).forEach(([currency, rate]) => {
        finalPrice[currency] = usdPrice * rate;
      });

      history = [
        {
          rates: finalPrice,
          date: new Date().toISOString(),
        },
      ];
    }

    const property = this.propertyRepository.create({
      ...propertyData,
      price: finalPrice,
      priceHistory: history,
      owner,
      locationInfo: locationInfo,
      type: propertyType,
      status:
        isAdmin || isBroker
          ? PropertyStatusEnum.APPROVED
          : PropertyStatusEnum.PENDING,
    });

    await this.entityManager.save(property);

    return { property, message: 'Property created successfully' };
  }

  formatPrice(value: string | number | null): string | null {
    if (value === null || value === undefined) return null;
    return value.toString();
  }

  private formatProperty(
    item: Property,
    currency?: 'LAK' | 'USD' | 'VND',
  ): any {
    if (!currency) return item;
    const cur = currency;
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

  private async translateProperty(item: any, targetLang: string): Promise<any> {
    if (item.title) {
      item.title = await this.translateService.translateText(
        item.title,
        targetLang,
      );
    }

    if (item.description) {
      item.description = await this.translateService.translateText(
        item.description,
        targetLang,
      );
    }

    if (item.details?.content) {
      item.details.content = await Promise.all(
        item.details.content.map(async (c) => ({
          ...c,
          value: c.value
            ? await this.translateService.translateText(c.value, targetLang)
            : c.value,
        })),
      );
    }

    if (item.type) {
      item.type.name = await this.translateService.translateText(
        item.type.name,
        targetLang,
      );
      item.type.transactionType = (await this.translateService.translateText(
        item.type.transactionType,
        targetLang,
      )) as TransactionEnum;
    }

    if (item.transactionType) {
      item.transactionType = (await this.translateService.translateText(
        item.transactionType,
        targetLang,
      )) as TransactionEnum;
    }

    if (item.locationInfo) {
      if (item.locationInfo.name) {
        item.locationInfo.name = await this.translateService.translateText(
          item.locationInfo.name,
          targetLang,
        );
      }
      if (Array.isArray(item.locationInfo.strict)) {
        item.locationInfo.strict = await Promise.all(
          item.locationInfo.strict.map(async (s) =>
            s ? await this.translateService.translateText(s, targetLang) : s,
          ),
        );
      }
    }

    if (item.location) {
      for (const key of ['address', 'city', 'district', 'country']) {
        if (item.location[key]) {
          item.location[key] = await this.translateService.translateText(
            item.location[key],
            targetLang,
          );
        }
      }
    }

    if (item.owner) {
      for (const key of ['specialties', 'languages', 'certifications']) {
        if (Array.isArray(item.owner[key])) {
          item.owner[key] = await Promise.all(
            item.owner[key].map(async (v) =>
              v ? await this.translateService.translateText(v, targetLang) : v,
            ),
          );
        }
      }
      if (item.owner.role?.name) {
        item.owner.role.name = await this.translateService.translateText(
          item.owner.role.name,
          targetLang,
        );
      }
    }

    return item;
  }

  async getAll(params: GetPropertiesFilterDto, user: User) {
    const isAdmin = !!user?.role && user.role.toString() === 'Admin';

    const properties = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.owner', 'owner')
      .leftJoinAndSelect('owner.role', 'role')
      .leftJoinAndSelect('property.type', 'type')
      .leftJoinAndSelect('property.locationInfo', 'locationInfo')
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('property.createdAt', params.OrderSort);

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

    if (params.keyword) {
      properties.andWhere(
        '(property.title ILIKE :keyword OR property.description ILIKE :keyword)',
        { keyword: `%${params.keyword}%` },
      );
    }
    if (params.currency) {
      if (params.minPrice !== undefined) {
        properties.andWhere(
          `(property.price ->> :currency)::numeric >= :minPrice`,
          { currency: params.currency, minPrice: params.minPrice },
        );
      }
      if (params.maxPrice !== undefined) {
        properties.andWhere(
          `(property.price ->> :currency)::numeric <= :maxPrice`,
          { currency: params.currency, maxPrice: params.maxPrice },
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

    if (params.status && user.role.toString() === 'Admin') {
      properties.andWhere('property.status = :status', {
        status: params.status,
      });
    }

    const [result, total] = await properties.getManyAndCount();

    const targetLang = this.mapLang(params.currency || params.currency);

    const finalResult = await Promise.all(
      (params.currency
        ? result.map((item) => this.formatProperty(item, params.currency))
        : result
      ).map((item) => this.translateProperty(item, targetLang)),
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
      (params.currency
        ? result.map((item) => this.formatProperty(item, params.currency))
        : result
      ).map((item) => this.translateProperty(item, targetLang)),
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

    if (params.currency) {
      qb.andWhere(`property.price ? :currency`, { currency: params.currency });
    }

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
    const formattedProperty = this.formatProperty(property, params.currency);
    const translatedProperty = await this.translateProperty(
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
      (params.currency
        ? properties.map((item) => this.formatProperty(item, params.currency))
        : properties
      ).map((item) => this.translateProperty(item, targetLang)),
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
      (params.currency
        ? properties.map((item) => this.formatProperty(item, params.currency))
        : properties
      ).map((item) => this.translateProperty(item, targetLang)),
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

    if (
      updatePropertyDto.price !== undefined &&
      updatePropertyDto.price !== null
    ) {
      const newUsd = Number(updatePropertyDto.price);
      if (!isNaN(newUsd)) {
        const rates = await this.exchangeRateService.getRates();
        const converted: Record<string, number> = { USD: newUsd };

        Object.entries(rates).forEach(([currency, rate]) => {
          converted[currency] = newUsd * rate;
        });

        property.price = converted;
        property.priceHistory = [
          ...(property.priceHistory || []),
          {
            rates: converted,
            date: new Date().toISOString(),
          },
        ];
      }
    }

    Object.assign(property, {
      ...updatePropertyDto,
      typeId: undefined,
      price: property.price,
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
