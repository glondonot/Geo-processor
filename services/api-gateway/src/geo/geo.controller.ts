import { Body, Controller, Post, Logger } from '@nestjs/common';
import { ProcessRequestDto } from './dto/process.dto';
import { GeoService } from './geo.service';

@Controller('api')
export class GeoController {
  private readonly logger = new Logger(GeoController.name);

  constructor(private readonly geoService: GeoService) {
    this.logger.log('GeoController initialized');
  }

  @Post('process')
  async process(@Body() body: ProcessRequestDto) {
    this.logger.log('Processing points...');
    return this.geoService.processPoints(body);
  }
}