import { useCallback, useEffect } from "react";
import { useGetCollectionQuery } from "@entities/collection/api";
import { VIRTUAL_COLLECTIONS } from "@entities/collection/lib";

export const useIntervalLearning = () => {
  const {
    data: activeCollection,
    isLoading: activeLoading,
    isFetching: activeFetching,
    refetch: activeRefetch,
  } = useGetCollectionQuery(VIRTUAL_COLLECTIONS.ACTIVE);
  const {
    data: inactiveCollection,
    isLoading: inactiveLoading,
    isFetching: inactiveFetching,
    refetch: inactiveRefetch,
  } = useGetCollectionQuery(VIRTUAL_COLLECTIONS.INACTIVE);

  const isLoading = activeLoading || inactiveLoading;
  const isRefetching = activeFetching || inactiveFetching;

  const collectionsLength = {
    active: activeCollection?.cards.length || 0,
    inactive: inactiveCollection?.cards.length || 0,
  };

  const refetchQuery = useCallback(() => {
    activeRefetch();
    inactiveRefetch();
  }, [activeRefetch, inactiveRefetch]);

  useEffect(() => {
    refetchQuery();
  }, [refetchQuery]);

  return {
    isLoading,
    isRefetching,
    inactiveLength: collectionsLength.inactive,
    activeLength: collectionsLength.active,
  };
};
