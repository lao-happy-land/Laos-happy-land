import { Module } from '@nestjs/common';

import { UserModule } from './modules/user/user.module';
import { DbModule } from './common/db/db.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PropertyModule } from './modules/property/property.module';
import { PropertyTypeModule } from './modules/property-type/property-type.module';
import { UserRoleModule } from './modules/user-role/user-role.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    UserModule,
    AuthModule,
    PropertyModule,
    PropertyTypeModule,
    UserRoleModule
  ],
})
export class AppModule {}
