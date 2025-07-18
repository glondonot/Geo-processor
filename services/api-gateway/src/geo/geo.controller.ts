import { Body, Controller, Post } from '@nestjs/common';
import { ProcessRequestDto } from './dto/process.dto';
import { GeoService } from './geo.service';

@Controller('api')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @Post('process')
  async process(@Body() body: ProcessRequestDto) {
    return this.geoService.processPoints(body);
  }
}