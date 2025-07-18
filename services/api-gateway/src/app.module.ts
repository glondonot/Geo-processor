import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { GeoModule } from './geo/geo.module';
import { HttpModule } from '@nestjs/axios';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    HttpModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore as any,
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        ttl: 60 * 5, // 5 minutes
        max: 100, // maximum number of items in cache
        isCacheableValue: (val: any) => val !== undefined && val !== null,
      }),
    }),
    GeoModule,
  ],
})
export class AppModule {}
