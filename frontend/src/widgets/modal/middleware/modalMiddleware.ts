import { openModal, closeModal } from "@entities/modal/model";
import { nanoid, type Middleware } from "@reduxjs/toolkit";
import {
  openModalWithPromise,
  confirmModalAction,
  cancelModalAction,
} from "../actions";
import { ModalPromisesManager } from "../services";

const modalPromises = new ModalPromisesManager();

export const modalMiddleware: Middleware = (store) => (next) => (action) => {
  if (openModalWithPromise.match(action)) {
    const modalId = nanoid();
    store.dispatch(openModal({ ...action.payload, modalId }));
    return modalPromises.create(modalId, undefined, () =>
      store.dispatch(closeModal()),
    );
  }

  if (confirmModalAction.match(action) || cancelModalAction.match(action)) {
    const modalId = store.getState().modal.modalId;
    if (modalId) {
      const result = action.type === confirmModalAction.type;
      modalPromises.action(modalId, result);
    }
    store.dispatch(closeModal());
    return;
  }

  return next(action);
};
