const VIRTUAL_COLLECTIONS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

type VirtualCollectionIdType =
  (typeof VIRTUAL_COLLECTIONS)[keyof typeof VIRTUAL_COLLECTIONS];

export const isVirtualCollection = (
  id: string,
): id is VirtualCollectionIdType => {
  return Object.values(VIRTUAL_COLLECTIONS).includes(
    id as VirtualCollectionIdType,
  );
};
