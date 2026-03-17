import type { ICard } from "@shared/api";

type FlashCardsStateType = {
  unmemTerms: number;
  actualStatus: { id: string; status: "ACTIVE" | "INACTIVE" }[];
  isReversed: boolean;
  isModalOpen: boolean;
  isMenuOpen: boolean;
  index: number;
};

type FlashCardsActionsType =
  | {
      type: "HANDLE_CHOSEN_STATUS";
      payload: { collection: ICard[]; status: boolean };
    }
  | { type: "TOGGLE_REVERSED" }
  | { type: "TOGGLE_MENU" }
  | { type: "CLOSE_MENU" }
  | { type: "RESET_FOR_RETRY" };

export const initialState: FlashCardsStateType = {
  unmemTerms: 0,
  actualStatus: [],
  isReversed: false,
  isModalOpen: false,
  isMenuOpen: false,
  index: 0,
};

export function flashCardsReducer(
  state: FlashCardsStateType,
  action: FlashCardsActionsType,
): FlashCardsStateType {
  switch (action.type) {
    case "TOGGLE_MENU":
      return { ...state, isMenuOpen: !state.isMenuOpen };
    case "CLOSE_MENU":
      return { ...state, isMenuOpen: false };
    case "TOGGLE_REVERSED":
      return { ...state, isReversed: !state.isReversed };
    case "HANDLE_CHOSEN_STATUS": {
      const { collection, status } = action.payload;
      const newState = { ...state };
      if (!status) {
        newState.actualStatus = [
          ...newState.actualStatus,
          { id: collection[newState.index].id, status: "INACTIVE" },
        ];
        newState.unmemTerms++;
      } else {
        newState.actualStatus = [
          ...newState.actualStatus,
          { id: collection[newState.index].id, status: "ACTIVE" },
        ];
      }
      if (newState.index >= collection.length - 1) {
        newState.isModalOpen = true;
      } else {
        newState.index += 1;
      }
      return newState;
    }
    case "RESET_FOR_RETRY":
      return {
        ...state,
        index: 0,
        isModalOpen: false,
        actualStatus: [],
        unmemTerms: 0,
      };
    default:
      return state;
  }
}
