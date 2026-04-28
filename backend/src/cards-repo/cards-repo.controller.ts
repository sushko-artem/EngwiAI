import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CardsRepoService } from './cards-repo.service';
import { User } from '@generated/prisma/client';
import { CollectionIdsDto, CreateCollectionDto, UpdateCollectionDto } from './DTO';
import { GetCurrentUser } from '@common/decorators';
import { CollectionIdPipe } from './pipes/collection-id.pipe';

@Controller('collections')
export class CardsRepoController {
  constructor(private readonly cardsRepoService: CardsRepoService) {}

  @Post('create')
  async create(@Body() dto: CreateCollectionDto, @GetCurrentUser() user: User) {
    return this.cardsRepoService.createCollection(user.id, dto);
  }

  @Get('list')
  async getCollectionsList(@GetCurrentUser() user: User) {
    return this.cardsRepoService.getCollectionsList(user.id);
  }

  @Post('cards/batch')
  @HttpCode(200)
  async getCardsFromCollection(@GetCurrentUser() user: User, @Body() dto: CollectionIdsDto) {
    return this.cardsRepoService.getCardsFromCollections(user.id, dto.collectionIds);
  }

  @Get(':id')
  async getCollection(@Param('id', CollectionIdPipe) id: string, @GetCurrentUser() user: User) {
    return this.cardsRepoService.getCollection(user.id, id);
  }

  @Delete('delete/:id')
  async deleteCollection(@Param('id', ParseUUIDPipe) id: string) {
    return this.cardsRepoService.deleteCollection(id);
  }

  @Post('update/:id')
  async update(@Param('id', CollectionIdPipe) collectionId: string, @Body() dto: UpdateCollectionDto) {
    return this.cardsRepoService.updateCollection(collectionId, dto);
  }
}
