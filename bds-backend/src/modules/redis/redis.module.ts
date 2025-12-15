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
          store: new KeyvRedis('redis://127.0.0.1:6379'),
          ttl: 300_000, // ms
        }),
      ],
    }),
  ],
})
export class RedisModule {}
