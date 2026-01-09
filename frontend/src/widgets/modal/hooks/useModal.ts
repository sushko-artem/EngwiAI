import { openModal } from "@entities/modal/model";
import { useAppDispatch } from "@redux/hooks";
import { useCallback } from "react";
import { openModalWithPromise } from "../actions";

export const useModal = () => {
  const dispatch = useAppDispatch();

  const warning = useCallback(
    (message: string) => {
      dispatch(openModal({ mode: "WARN", message }));
    },
    [dispatch]
  );

  const confirm = useCallback(
    (message: string) => {
      return dispatch(openModalWithPromise("CONFIRM", message));
    },
    [dispatch]
  );

  return { warning, confirm };
};
