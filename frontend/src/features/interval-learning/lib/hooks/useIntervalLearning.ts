import { useCallback, useEffect, useMemo } from "react";
import { useGetCollectionQuery } from "@entities/collection/api";
import { VIRTUAL_COLLECTIONS } from "@entities/collection/lib";
import { useNavigate } from "react-router-dom";
import backArrow from "@assets/images/arrow-left.svg";

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

  const headerProps = useMemo(
    () => ({
      title: "Контрольное тестирование",
      leftIcon: backArrow,
      leftIconTitle: "Вернуться на главную",
      leftIconAction: () => navigate("/dashboard"),
    }),
    [navigate],
  );

  return {
    headerProps,
    isLoading,
    isRefetching,
    inactiveLength: collectionsLength.inactive,
    activeLength: collectionsLength.active,
  };
};
