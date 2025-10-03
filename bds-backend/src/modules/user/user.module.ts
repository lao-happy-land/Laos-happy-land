import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { UserRole } from 'src/entities/user-role.entity';
import { CloudinaryService } from 'src/service/cloudinary.service';
import { TranslateService } from 'src/service/translate.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  providers: [UserService, CloudinaryService, TranslateService],  
  controllers: [UserController]
})
export class UserModule {}
