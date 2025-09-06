import { collectionsService, type ICollectionCardsResponse } from "@shared/api";
import useSWR from "swr";

export const useCollection = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR<ICollectionCardsResponse>(
    id ? `collection-${id}` : null,
    () => collectionsService.getOne(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    collection: data,
    loading: isLoading,
    error,
    refresh: () => mutate(),
  };
};
