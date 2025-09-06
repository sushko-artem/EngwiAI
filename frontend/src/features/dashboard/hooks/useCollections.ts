import useSWR from "swr";
import { collectionsService } from "@shared/api/services/collectionsService";
import type {
  ICollectionDto,
  ICollectionResponse,
} from "@shared/api/types/collection";

export const useCollections = () => {
  const {
    data: collections,
    error,
    isLoading,
    mutate,
  } = useSWR<ICollectionResponse[]>("collections", collectionsService.getList, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const createCollection = async (dto: ICollectionDto) => {
    try {
      const newCollection = await collectionsService.create(dto);
      mutate(
        (current) => (current ? [...current, newCollection] : [newCollection]),
        false
      );
      return { success: true, data: newCollection };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка создания коллекции";
      return { success: false, error: message };
    }
  };

  return {
    collections: collections || [],
    loading: isLoading,
    error,
    createCollection,
    refresh: () => mutate(),
  };
};
