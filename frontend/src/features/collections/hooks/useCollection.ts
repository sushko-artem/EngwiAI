import useSWR from "swr";
import {
  collectionsService,
  type ICollectionCardsResponse,
  type IUpdateCollectionDto,
} from "@shared/api";

export const useCollection = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR<ICollectionCardsResponse>(
    id ? `collection-${id}` : null,
    () => collectionsService.getOne(id),
    {
      revalidateOnReconnect: false,
    }
  );

  const updateCollection = async (dto: IUpdateCollectionDto) => {
    try {
      await collectionsService.update(id, dto);
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ошибка редактирования коллекции";
      return { success: false, error: message };
    }
  };

  return {
    updateCollection,
    collection: data,
    loading: isLoading,
    error,
    refresh: () => mutate(),
  };
};
