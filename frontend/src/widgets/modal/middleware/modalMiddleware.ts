import { openModal, closeModal } from "@entities/modal/model";
import { nanoid, type Middleware } from "@reduxjs/toolkit";
import {
  openModalWithPromise,
  confirmModalAction,
  cancelModalAction,
} from "../actions";

export const modalPromises = new Map<
  string,
  {
    resolve: (result: boolean) => void;
    timeoutId: ReturnType<typeof setTimeout>;
  }
>();

export const MODAL_TIMEOUT = 5 * 60 * 1000;

export const modalMiddleware: Middleware = (store) => (next) => (action) => {
  if (openModalWithPromise.match(action)) {
    return new Promise<boolean>((resolve) => {
      const modalId = nanoid();
      //Clear if the modal is dangling
      const timeoutId = setTimeout(() => {
        if (modalPromises.has(modalId)) {
          resolve(false);
          modalPromises.delete(modalId);
          store.dispatch(closeModal());
        }
      }, MODAL_TIMEOUT);
      modalPromises.set(modalId, { resolve, timeoutId });
      store.dispatch(openModal({ ...action.payload, modalId }));
    });
  }

  if (confirmModalAction.match(action) || cancelModalAction.match(action)) {
    const modalId = store.getState().modal.modalId;
    if (modalId && modalPromises.has(modalId)) {
      const { resolve, timeoutId } = modalPromises.get(modalId)!;
      clearTimeout(timeoutId);
      const result = action.type === confirmModalAction.type;
      resolve(result);
      modalPromises.delete(modalId);
    }
    store.dispatch(closeModal());
    return;
  }

  return next(action);
};
