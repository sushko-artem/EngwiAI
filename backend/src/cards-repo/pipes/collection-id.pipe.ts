import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class CollectionIdPipe implements PipeTransform {
  transform(value: string) {
    if (value === 'active' || value === 'inactive') {
      return value;
    }
    if (!isUUID(value, '4')) {
      throw new BadRequestException('Invalid collection ID format');
    }
    return value;
  }
}
