import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { UserRole } from 'src/entities/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  providers: [UserService],  
  controllers: [UserController]
})
export class UserModule {}
