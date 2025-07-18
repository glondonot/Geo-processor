import { Injectable, Inject, HttpException, Logger, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import axios from 'axios';
import { ProcessRequestDto } from './dto/process.dto';
import * as crypto from 'crypto';

@Injectable()
export class GeoService implements OnModuleInit {
  private readonly fastapiUrl = process.env.BACKEND_FASTAPI_URL;
  private readonly logger = new Logger(GeoService.name);
  private redisAvailable = false;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  
  async onModuleInit() {
    try {
      const testKey = 'test-redis-connection';
      await this.cacheManager.set(testKey, 'connected', 10000);
      const testResult = await this.cacheManager.get(testKey);
      
      if (testResult === 'connected') {
        this.redisAvailable = true;
        this.logger.log('Redis connection established');
      } else {
        this.redisAvailable = false;
      }
    } catch (error) {
      this.redisAvailable = false;
    }
  }

  async processPoints(body: ProcessRequestDto) {
    const key = this.getCacheKey(body);
    
    try {
      if (this.redisAvailable) {
        try {
          const cachedResult = await this.cacheManager.get<any>(key);
          
          if (cachedResult) {
            this.logger.log('[CACHE HIT]');
            return cachedResult;
          }
        } catch (cacheError) {
          this.logger.warn('Cache read error');
          this.redisAvailable = false;
        }
      }
      
      const response = await axios.post(`${this.fastapiUrl}process`, body);
      const data = response.data;

      if (this.redisAvailable) {
        try {
          await this.cacheManager.set(key, data, 300 * 1000);
          this.logger.log('[CACHE MISS] - Saving to Redis');
        } catch (cacheError) {
          this.redisAvailable = false;
        }
      }

      return data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.detail || 'Error communicating with FastAPI service',
        error.response?.status || 500,
      );
    }
  }

  private getCacheKey(body: ProcessRequestDto): string {
    const normalizedPoints = body.points.map(point => ({
      lat: parseFloat(point.lat.toFixed(6)), // Normalize floating-point precision
      lng: parseFloat(point.lng.toFixed(6))
    }))
    .sort((a, b) => a.lat - b.lat || a.lng - b.lng); // Sort by lat, then by lng

    const pointsString = JSON.stringify(normalizedPoints);
    
    const hash = crypto.createHash('sha256');
    hash.update(pointsString);
    return `geo:${hash.digest('hex')}`;
  }
}