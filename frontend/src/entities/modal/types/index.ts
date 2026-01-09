export type ModalModeType = "WARN" | "CONFIRM" | "CLOSED";

export type ModalPropType = {
  mode: ModalModeType;
  message: string;
  modalId?: string;
};

export type ConfirmActionsType = {
  actions: {
    cancel(): void;
    confirm?(): void;
  };
};
