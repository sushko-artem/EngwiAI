import { createPortal } from "react-dom";
import {
  closeModal,
  selectModalState,
  cancel,
  confirm,
} from "@entities/modal/model";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { ModalView } from "../ui/modal-view";

export const ModalRootContainer = () => {
  const modalContainer = document.getElementById("modal") as HTMLDivElement;
  const modalState = useAppSelector(selectModalState);
  const dispatch = useAppDispatch();

  if (!modalState.isOpen) return null;

  const getActions = () => {
    switch (modalState.mode) {
      case "WARN":
        return {
          cancel: () => dispatch(closeModal()),
          confirm: undefined,
        };
      case "CONFIRM":
        return {
          cancel: () => dispatch(cancel()),
          confirm: () => dispatch(confirm()),
        };
      default:
        return { cancel: () => {}, confirm: undefined };
    }
  };

  const actions = getActions();

  return createPortal(
    <ModalView {...modalState} actions={actions} />,
    modalContainer
  );
};
