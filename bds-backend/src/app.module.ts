import { Module } from '@nestjs/common';

import { UserModule } from './modules/user/user.module';
import { DbModule } from './common/db/db.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PropertyModule } from './modules/property/property.module';
import { PropertyTypeModule } from './modules/property-type/property-type.module';
import { UserRoleModule } from './modules/user-role/user-role.module';
import { ImageModule } from './modules/image/image.module';
import { SettingModule } from './modules/setting/setting.module';
import { ExchangeRateModule } from './modules/exchange-rate/exchange-rate.module';
import { LocationInfoModule } from './modules/location-info/location-info.module';
import { NewsTypeModule } from './modules/news-type/news-type.module';
import { NewsModule } from './modules/news/news.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    UserModule,
    AuthModule,
    PropertyModule,
    PropertyTypeModule,
    UserRoleModule,
    ImageModule,
    SettingModule,
    ExchangeRateModule,
    LocationInfoModule,
    NewsTypeModule,
    NewsModule
  ],
})
export class AppModule {}
