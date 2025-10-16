import useSWR from "swr";
import { collectionsService } from "@shared/api";
import type { ICollectionDto, ICollectionResponse } from "@shared/api";
import { useCallback } from "react";

export const useCollections = () => {
  const {
    data: collections,
    error,
    isLoading,
    mutate,
  } = useSWR<ICollectionResponse[]>("collections", collectionsService.getList, {
    revalidateOnReconnect: false,
  });

  const createCollection = useCallback(async (dto: ICollectionDto) => {
    try {
      const newCollection = await collectionsService.create(dto);
      return { success: true, data: newCollection };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка создания коллекции";
      return { success: false, error: message };
    }
  }, []);

  return {
    collections: collections || [],
    loading: isLoading,
    error,
    createCollection,
    refresh: () => mutate(),
  };
};
