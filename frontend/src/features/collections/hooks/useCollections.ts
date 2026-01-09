import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useDeleteCollectionMutation,
  useGetCollectionsQuery,
} from "@features/collections/api";
import { useModal } from "@widgets/modal";

export const useCollections = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirm } = useModal();
  const refetchFlag = location.state?.refetch;
  const {
    data: collections,
    isLoading,
    refetch,
    error,
  } = useGetCollectionsQuery();
  const [deleteCollection] = useDeleteCollectionMutation();
  const [isRefetching, setIsRefetching] = useState(false);
  const collectionsRef = useRef(collections);
  collectionsRef.current = collections;

  useEffect(() => {
    if (refetchFlag) {
      setIsRefetching(true);
      refetch().finally(() => {
        setIsRefetching(false);
        navigate(location.pathname, { replace: true, state: {} });
      });
    }
  }, [refetchFlag, refetch, navigate, location.pathname]);

  const onDelete = useCallback(
    async (id: string) => {
      const isDelete = await confirm(
        `Удалить коллекцию ${
          collectionsRef.current?.find((collection) => collection.id === id)
            ?.name
        }?`
      );
      if (isDelete) {
        try {
          await deleteCollection(id).unwrap();
        } catch (error) {
          console.error(error);
        }
      }
    },
    [deleteCollection, confirm]
  );

  const back = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  return {
    collections,
    isLoading,
    error,
    isRefetching,
    onDelete,
    back,
  };
};
