import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useDeleteCollectionMutation,
  useGetCollectionsQuery,
} from "@features/collections/api";
import type { ModalModeType } from "@widgets/modal-confirm";

export const useCollections = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const refetchFlag = location.state?.refetch;
  const {
    data: collections,
    isLoading,
    refetch,
    error,
  } = useGetCollectionsQuery();
  const [deleteCollection] = useDeleteCollectionMutation();
  const [isRefetching, setIsRefetching] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [modaleMode, setModaleMode] = useState<ModalModeType>(null);

  useEffect(() => {
    if (refetchFlag) {
      setIsRefetching(true);
      refetch().finally(() => {
        setIsRefetching(false);
        navigate(location.pathname, { replace: true, state: {} });
      });
    }
  }, [refetchFlag, refetch, navigate, location.pathname]);

  const onDelete = useCallback((id: string) => {
    setModaleMode("confirm");
    setId(id);
  }, []);

  const confirmAction = useCallback(
    async (value: boolean) => {
      if (value) {
        try {
          setModaleMode(null);
          await deleteCollection(id!).unwrap();
        } catch (error) {
          console.error(error);
        }
      } else {
        setModaleMode(null);
        setId(null);
      }
    },
    [deleteCollection, id]
  );

  const back = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  return {
    collections,
    isLoading,
    error,
    modaleMode,
    isRefetching,
    onDelete,
    confirmAction,
    back,
    id,
  };
};
