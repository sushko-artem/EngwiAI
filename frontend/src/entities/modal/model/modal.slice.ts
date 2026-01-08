import type { RootState } from "@redux/store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ModalPropType, ModalModeType } from "../types";
interface IModalState {
  isOpen: boolean;
  mode: ModalModeType;
  message: string;
  modalId?: string;
}

const initialState: IModalState = {
  isOpen: false,
  mode: "CLOSED",
  message: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalPropType>) => {
      state.isOpen = true;
      state.mode = action.payload.mode;
      state.message = action.payload.message;
      if (action.payload.modalId) {
        state.modalId = action.payload.modalId;
      }
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.mode = "CLOSED";
      state.message = "";
      state.modalId = undefined;
    },
    confirm: () => {},
    cancel: () => {},
  },
});

export const selectModalState = (state: RootState) => state.modal;

export const { openModal, closeModal, confirm, cancel } = modalSlice.actions;
export default modalSlice.reducer;
