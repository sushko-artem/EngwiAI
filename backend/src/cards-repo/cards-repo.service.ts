import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CardUpdateDto, CreateCollectionDto, UpdateCollectionDto } from './DTO';
import { CardStatus } from '@generated/prisma/enums';
import { isVirtualCollection, VIRTUAL_COLLECTION_TO_STATUS } from './constants/virtual-collection-ident';

@Injectable()
export class CardsRepoService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createCollection(userId: string, dto: CreateCollectionDto) {
    return this.prisma.$transaction(async (prisma) => {
      const collection = await prisma.collection.create({
        data: {
          userId,
          name: dto.name,
        },
      });

      if (dto.cards.length > 0) {
        await prisma.card.createMany({
          data: dto.cards.map((card) => ({
            collectionId: collection.id,
            word: card.word,
            translation: card.translation,
          })),
        });
      }
      return { id: collection.id, name: collection.name };
    });
  }

  async getCollection(userId: string, collectionId: string) {
    if (isVirtualCollection(collectionId)) {
      const status = VIRTUAL_COLLECTION_TO_STATUS[collectionId];
      return this.getCardsByStatus(userId, status);
    }
    let collection = await this.cacheManager.get(collectionId);
    if (!collection) {
      collection = await this.prisma.collection.findUnique({
        where: {
          id: collectionId,
          userId,
        },
        include: {
          cards: {
            select: {
              id: true,
              word: true,
              translation: true,
              status: true,
            },
          },
        },
      });
      await this.cacheManager.set(collectionId, collection);
      return collection;
    }
    return collection;
  }

  async getCollectionsList(userId: string) {
    return await this.prisma.collection.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async updateCollection(collectionId: string, updates: UpdateCollectionDto) {
    if (isVirtualCollection(collectionId)) {
      const cards = updates.updatedCards as CardUpdateDto[];
      await this.updateCardStatus(cards);
      return;
    }
    await this.cacheManager.del(collectionId);
    return await this.prisma.$transaction(async (prisma) => {
      // Изменение имени коллекции
      if (updates.newName) {
        await prisma.collection.update({
          where: {
            id: collectionId,
          },
          data: {
            name: updates.newName,
          },
        });
      }
      // Изменение существующих карточек
      if (updates.updatedCards?.length) {
        await Promise.all(
          updates.updatedCards.map((card) =>
            prisma.card.update({
              where: {
                id: card.id,
              },
              data: {
                word: card.word,
                translation: card.translation,
                status: card.status,
              },
            }),
          ),
        );
      }
      // Добавление новых карточек
      if (updates.newCards?.length) {
        await prisma.card.createMany({
          data: updates.newCards.map((card) => ({
            collectionId,
            word: card.word,
            translation: card.translation,
          })),
        });
      }
      // Удаление карточек
      if (updates.deletedCards?.length) {
        await prisma.card.deleteMany({
          where: {
            id: { in: updates.deletedCards },
            collectionId,
          },
        });
      }
      return { success: true };
    });
  }

  async deleteCollection(id: string) {
    await this.cacheManager.del(id);
    return await this.prisma.collection.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }

  async getCardsByStatus(userId: string, status: CardStatus) {
    const collectionId = status.toLowerCase();
    const collectionName = collectionId === 'active' ? 'Изученные' : 'Неизученные';
    const cards = await this.prisma.card.findMany({
      where: {
        collection: {
          userId,
        },
        status,
      },
    });
    return {
      id: collectionId,
      name: collectionName,
      cards,
    };
  }

  async updateCardStatus(cards: CardUpdateDto[]) {
    const result = await this.prisma.$transaction(async (prisma) => {
      const cardsIds = cards.map((c) => c.id);

      const cardsWithCollections = await prisma.card.findMany({
        where: { id: { in: cardsIds } },
        select: { collectionId: true },
      });

      const collectionIds = [...new Set(cardsWithCollections.map((c) => c.collectionId))];

      await Promise.all(
        cards.map((card) =>
          prisma.card.update({
            where: { id: card.id },
            data: { status: card.status },
          }),
        ),
      );

      return collectionIds;
    });
    await Promise.all(result.map((id) => this.cacheManager.del(id)));
    return { success: true };
  }
}
