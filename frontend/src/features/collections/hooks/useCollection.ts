import useSWR from "swr";
import {
  collectionsService,
  type ICollectionCardsResponse,
  type IUpdateCollectionDto,
} from "@shared/api";
import { useCallback, useState } from "react";

export const useCollection = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR<ICollectionCardsResponse>(
    id ? `collection-${id}` : null,
    () => collectionsService.getOne(id),
    {
      revalidateOnReconnect: false,
    }
  );

  const [isUpdating, setIsUpdating] = useState(false);

  const updateCollection = useCallback(
    async (dto: IUpdateCollectionDto) => {
      try {
        setIsUpdating(true);
        await collectionsService.update(id, dto);
        return { success: true };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Ошибка редактирования коллекции";
        return { success: false, error: message };
      } finally {
        setIsUpdating(false);
      }
    },
    [id]
  );

  return {
    updateCollection,
    collection: data,
    loading: isLoading,
    update: isUpdating,
    error,
    refresh: () => mutate(),
  };
};
