import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCollectionQuery } from "@features/collections/api";
import { VIRTUAL_COLLECTIONS } from "@features/collections/helpers/virtual-collection-ident-helper";

export const useIntervalLearning = () => {
  const navigate = useNavigate();
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

  const back = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  return {
    back,
    isLoading,
    isRefetching,
    inactiveLength: collectionsLength.inactive,
    activeLength: collectionsLength.active,
  };
};
