import { Module } from '@nestjs/common';

import { UserModule } from './modules/user/user.module';
import { DbModule } from './common/db/db.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PropertyModule } from './modules/property/property.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    UserModule,
    AuthModule,
    PropertyModule],
})
export class AppModule {}
