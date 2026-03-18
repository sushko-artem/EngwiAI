import { CardStatus } from '@generated/prisma/enums';

export const VIRTUAL_COLLECTION_TO_STATUS = {
  active: CardStatus.ACTIVE,
  inactive: CardStatus.INACTIVE,
};

export type VirtualCollectionIdType = keyof typeof VIRTUAL_COLLECTION_TO_STATUS;

export const isVirtualCollection = (id: string): id is VirtualCollectionIdType => id in VIRTUAL_COLLECTION_TO_STATUS;
