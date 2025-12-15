import { CacheModule } from '@nestjs/cache-manager';
import { Module, Global } from '@nestjs/common';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

@Global()
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      stores: [
        new Keyv({
          store: new KeyvRedis(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`),
          ttl: 300_000,
        }),
      ],
    }),
  ],
})
export class RedisModule {}
