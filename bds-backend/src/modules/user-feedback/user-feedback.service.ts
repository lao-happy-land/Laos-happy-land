import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFeedback } from 'src/entities/user-feedback.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserFeedbackDto } from './dto/create_user_feedback.dto';
import { GetUserFeedbackDto } from './dto/get_user_feedback.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';

@Injectable()
export class UserFeedbackService {
  constructor(
    @InjectRepository(UserFeedback)
    private readonly userFeedbackRepository: Repository<UserFeedback>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createUserFeedbackDto: CreateUserFeedbackDto,
    reviewerId: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: createUserFeedbackDto.userId },
    });
    if (!user) throw new BadRequestException('User not found');

    const reviewer = await this.userRepository.findOne({
      where: { id: reviewerId },
    });
    if (!reviewer) throw new BadRequestException('Reviewer not found');

    const existed = await this.userFeedbackRepository.findOne({
      where: {
        user: { id: user.id },
        reviewer: { id: reviewer.id },
      },
    });
    if (existed) {
      throw new BadRequestException(
        'You have already given feedback to this user',
      );
    }

    const feedback = this.userFeedbackRepository.create({
      user,
      reviewer,
      rating: createUserFeedbackDto.rating,
      comment: createUserFeedbackDto.comment,
    });

    const savedFeedback = await this.userFeedbackRepository.save(feedback);

    const [count, { avg }] = await Promise.all([
      this.userFeedbackRepository.count({ where: { user: { id: user.id } } }),
      this.userFeedbackRepository
        .createQueryBuilder('feedback')
        .select('AVG(feedback.rating)', 'avg')
        .where('feedback.user_id = :userId', { userId: user.id })
        .getRawOne<{ avg: string }>(),
    ]);

    user.ratingCount = count;
    user.ratingAverage = parseFloat((parseFloat(avg ?? '0')).toFixed(2));
    await this.userRepository.save(user);

    const freshFeedback = await this.userFeedbackRepository.findOne({
      where: { id: savedFeedback.id },
      relations: ['user', 'reviewer'],
    });

    return freshFeedback;
  }

  async getFeedbackByUserId(params: GetUserFeedbackDto, userId: string) {
    const queryBuilder = this.userFeedbackRepository
      .createQueryBuilder('feedback')
      .where('feedback.user_id = :userId', { userId })
      .leftJoinAndSelect('feedback.user', 'user')
      .leftJoinAndSelect('feedback.reviewer', 'reviewer')
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('feedback.createdAt', params.OrderSort);

    const [result, total] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id: string) {
    const queryBuilder = this.userFeedbackRepository
      .createQueryBuilder('feedback')
      .where('feedback.id = :id', { id })
      .leftJoinAndSelect('feedback.user', 'user')
      .leftJoinAndSelect('feedback.reviewer', 'reviewer')
      .getOne();
    if (!queryBuilder) {
      throw new BadRequestException('Feedback not found');
    }
    return { queryBuilder, message: 'Success' };
  }
}
