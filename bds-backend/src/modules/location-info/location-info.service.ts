import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Multer } from 'multer';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { LocationInfo } from 'src/entities/location-info.entity';
import { CloudinaryService } from 'src/service/cloudinary.service';
import { TranslateService } from 'src/service/translate.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateLocationInfoDto } from './dto/create_location_info.dto';
import { GetOneLocationInfoDto } from './dto/get-location-info-id.dto';
import { GetLocationInfoDto } from './dto/get_location_info.dto';

@Injectable()
export class LocationInfoService {
  constructor(
    @InjectRepository(LocationInfo)
    private readonly locationInfoRepository: Repository<LocationInfo>,
    private readonly entityManager: EntityManager,
    private readonly cloudinaryService: CloudinaryService,
    private readonly translateService: TranslateService,
  ) {}

  private mapLang(param?: string): string {
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

  /** Save translated name into translatedContent */
  public async saveTranslations(location: LocationInfo) {
    const langs = ['en', 'lo', 'vi'];
    const translatedContent: Record<string, any> = {};

    for (const lang of langs) {
      translatedContent[lang] = {
        name: location.name
          ? await this.translateService.translateText(location.name, lang)
          : null,
      };
    }

    location.translatedContent = translatedContent;
    await this.locationInfoRepository.save(location);
  }

  /** Merge translated content with original */
  private pickTranslatedContent(location: LocationInfo, lang: string) {
    if (!location.translatedContent) return location;
    const translated = location.translatedContent?.[lang];
    if (!translated) return location;

    const merged: any = {
      ...location,
      name: translated.name || location.name,
    };

    delete merged.translatedContent;
    return merged;
  }

  async create(
    createLocationInfoDto: CreateLocationInfoDto,
    image?: Multer.File,
  ) {
    let imageURL: string | null = null;
    if (image) {
      imageURL = await this.cloudinaryService.uploadAndReturnImageUrl(image);
    }
    const locationInfo = this.locationInfoRepository.create({
      ...createLocationInfoDto,
      imageURL,
    });
    await this.locationInfoRepository.save(locationInfo);
    await this.saveTranslations(locationInfo);

    return { locationInfo, message: 'Location created successfully' };
  }

  async update(
    id: string,
    updateLocationInfoDto: CreateLocationInfoDto,
    image?: Multer.File,
  ) {
    const locationInfo = await this.locationInfoRepository.findOneBy({ id });
    if (!locationInfo) {
      throw new BadRequestException('Location info not found');
    }
    if (image) {
      locationInfo.imageURL =
        await this.cloudinaryService.uploadAndReturnImageUrl(image);
    }

    Object.assign(locationInfo, updateLocationInfoDto);
    await this.locationInfoRepository.save(locationInfo);

    await this.saveTranslations(locationInfo);

    return { locationInfo, message: 'Location info updated successfully' };
  }

  async getAll(params: GetLocationInfoDto) {
    const qb = this.locationInfoRepository
      .createQueryBuilder('locationInfo')
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('locationInfo.createdAt', params.OrderSort);

    if (params.search) {
      qb.andWhere('locationInfo.name ILIKE :search', {
        search: `%${params.search}%`,
      });
    }

    const [result, total] = await qb.getManyAndCount();
    const targetLang = this.mapLang(params.lang);

    const translatedResult = result.map((item) =>
      this.pickTranslatedContent(item, targetLang),
    );

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(translatedResult, pageMetaDto, 'Success');
  }

  async getTrendingLocations(limit = 5, params: GetOneLocationInfoDto) {
    const qb = this.locationInfoRepository
      .createQueryBuilder('locationInfo')
      .orderBy('locationInfo.viewCount', 'DESC')
      .take(limit);

    const [result] = await qb.getManyAndCount();
    const targetLang = this.mapLang(params.lang);

    const translatedResult = result.map((item) =>
      this.pickTranslatedContent(item, targetLang),
    );

    const pageMetaDto = new PageMetaDto({
      itemCount: limit,
      pageOptionsDto: {
        perPage: limit,
        skip: 0,
      },
    });
    return new ResponsePaginate(translatedResult, pageMetaDto, 'Success');
  }

  async get(id: string, params: GetOneLocationInfoDto) {
    const locationInfo = await this.locationInfoRepository
      .createQueryBuilder('locationInfo')
      .where('locationInfo.id = :id', { id })
      .getOne();
    if (!locationInfo) {
      throw new BadRequestException('Location info not found');
    }

    locationInfo.viewCount = (locationInfo.viewCount || 0) + 1;
    await this.locationInfoRepository.save(locationInfo);

    const targetLang = this.mapLang(params.lang);
    const translated = this.pickTranslatedContent(locationInfo, targetLang);

    return { locationInfo: translated, message: 'Success' };
  }

  async remove(id: string) {
    const locationInfo = await this.locationInfoRepository.findOneBy({ id });
    if (!locationInfo) {
      throw new BadRequestException('Location info not found');
    }
    await this.locationInfoRepository.remove(locationInfo);
    return { message: 'Location info deleted successfully' };
  }
}
