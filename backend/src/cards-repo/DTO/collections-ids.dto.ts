import { IsArray, IsUUID } from 'class-validator';

export class CollectionIdsDto {
  @IsArray()
  @IsUUID('all', { each: true })
  collectionIds!: string[];
}
