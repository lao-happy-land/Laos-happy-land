import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationInfo } from 'src/entities/location-info.entity';
import { CloudinaryService } from 'src/service/cloudinary.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateLocationInfoDto } from './dto/create_location_info.dto';
import { Multer } from 'multer';
import { GetLocationInfoDto } from './dto/get_location_info.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';

@Injectable()
export class LocationInfoService {
  constructor(
    @InjectRepository(LocationInfo)
    private readonly locationInfoRepository: Repository<LocationInfo>,
    private readonly entityManager: EntityManager,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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
    return this.locationInfoRepository.save(locationInfo);
  }

  async getAll(params: GetLocationInfoDto) {
    const locationInfo = this.locationInfoRepository
      .createQueryBuilder('locationInfo')
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('locationInfo.createdAt', params.OrderSort);

    if (params.search) {
      locationInfo.andWhere('locationInfo.name ILIKE :search', {
        search: `%${params.search}%`,
      });
    }
    const [result, total] = await locationInfo.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async getTrendingLocations(limit = 5) {
    const locations = this.locationInfoRepository
      .createQueryBuilder('locationInfo')
      .orderBy('locationInfo.viewCount', 'DESC')
      .take(limit)

    const [result, total] = await locations.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: limit,
      pageOptionsDto: {
        perPage: limit,
        skip: 0
      },
    });
    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id: string) {
    const locationInfo = await this.locationInfoRepository
      .createQueryBuilder('locationInfo')
      .where('locationInfo.id = :id', { id })
      .getOne();
    if (!locationInfo) {
      throw new BadRequestException('Location info not found');
    }
    locationInfo.viewCount = (locationInfo.viewCount || 0) + 1;
    await this.locationInfoRepository.save(locationInfo);
    return { locationInfo, message: 'Success' };
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
    return { locationInfo, message: 'Location info updated successfully' };
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
