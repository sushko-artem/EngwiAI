import { addCard, updateCollectionName } from "@features/collections/model";
import { useAppDispatch } from "@redux/hooks";
import { useCallback } from "react";

export const useEdit = (scrollRef: React.RefObject<HTMLDivElement | null>) => {
  const dispatch = useAppDispatch();

  const handleNameChange = useCallback(
    (value: string) => {
      dispatch(updateCollectionName(value));
    },
    [dispatch]
  );

  const handleAddCard = useCallback(() => {
    dispatch(addCard());
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 200);
  }, [dispatch, scrollRef]);

  return {
    handleNameChange,
    handleAddCard,
  };
};
