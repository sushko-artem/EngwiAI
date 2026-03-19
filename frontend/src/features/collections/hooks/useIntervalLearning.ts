import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCollectionQuery } from "@features/collections/api";
import { VIRTUAL_COLLECTIONS } from "@features/collections/helpers/virtual-collection-ident-helper";

export const useIntervalLearning = () => {
  const navigate = useNavigate();
  const activeQuery = useGetCollectionQuery(VIRTUAL_COLLECTIONS.ACTIVE);
  const inactiveQuery = useGetCollectionQuery(VIRTUAL_COLLECTIONS.INACTIVE);

  const back = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  return {
    back,
    isLoading: activeQuery.isLoading || inactiveQuery.isLoading,
    error: activeQuery.error || inactiveQuery.error,
    inactiveLength: inactiveQuery.data?.cards.length || 0,
    activeLength: activeQuery.data?.cards.length || 0,
  };
};
