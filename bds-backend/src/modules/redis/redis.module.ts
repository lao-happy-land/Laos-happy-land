import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Keyv from 'keyv';

@Global()
@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST');
        const port = configService.get<string>('REDIS_PORT');
        const url = configService.get<string>('REDIS_URL');

        const redisUrl = url || `redis://${host}:${port}`;
        return {
          stores: [
            new Keyv({
              store: new KeyvRedis(redisUrl),
              ttl: 300_000,
            }),
          ],
        };
      },
    }),
  ],
})
export class RedisModule {}
