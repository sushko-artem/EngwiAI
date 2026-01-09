import type { ModalModeType } from "@entities/modal/types";
import { createAction } from "@reduxjs/toolkit";

export const openModalWithPromise = createAction(
  "modal/openModalWithPromise",
  (mode: ModalModeType, message: string) => ({
    payload: { mode, message },
  })
);

export const confirmModalAction = createAction("modal/confirm");
export const cancelModalAction = createAction("modal/cancel");
