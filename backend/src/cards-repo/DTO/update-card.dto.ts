import { CardStatus } from '@generated/prisma/enums';
import { IsOptional, IsString } from 'class-validator';

export class CardUpdateDto {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  status?: CardStatus;

  @IsString()
  @IsOptional()
  word?: string;

  @IsString()
  @IsOptional()
  translation?: string;
}
