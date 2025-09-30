import { Module } from '@nestjs/common';
import { UserFeedbackController } from './user-feedback.controller';
import { UserFeedbackService } from './user-feedback.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFeedback } from 'src/entities/user-feedback.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserFeedback, User])],
  controllers: [UserFeedbackController],
  providers: [UserFeedbackService]
})
export class UserFeedbackModule {}
