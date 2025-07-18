import { IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class PointDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class ProcessRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PointDto)
  points: PointDto[];
}
