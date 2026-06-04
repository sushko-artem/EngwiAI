type SpellTestStateType = {
  index: number;
  rightAnswersCounter: number;
  mistakesMadeIn: Record<string, string>;
  isMenuOptionsOpen: boolean;
  isSummaryModalOpen: boolean;
  inProgress: boolean;
};

type SpellTestActionsType =
  | {
      type: "HANDLE_ANSWER";
      payload: {
        collectionLength: number;
        userAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
      };
    }
  | { type: "RESET_TEST" }
  | { type: "TOGGLE_MENU" }
  | { type: "CLOSE_MENU" };

export const initialState: SpellTestStateType = {
  index: 0,
  rightAnswersCounter: 0,
  mistakesMadeIn: {},
  isSummaryModalOpen: false,
  isMenuOptionsOpen: false,
  inProgress: true,
};

export function spellTestReducer(
  state: SpellTestStateType,
  action: SpellTestActionsType,
): SpellTestStateType {
  switch (action.type) {
    case "HANDLE_ANSWER": {
      const {
        collectionLength: length,
        userAnswer,
        correctAnswer,
        isCorrect,
      } = action.payload;

      const newState = { ...state };

      if (!isCorrect) {
        newState.mistakesMadeIn = {
          ...newState.mistakesMadeIn,
          [correctAnswer]: userAnswer,
        };
      } else {
        newState.rightAnswersCounter += 1;
      }

      if (newState.index === length - 1) {
        newState.isSummaryModalOpen = true;
        newState.inProgress = false;
      } else {
        newState.index += 1;
      }
      return newState;
    }
    case "TOGGLE_MENU": {
      return { ...state, isMenuOptionsOpen: !state.isMenuOptionsOpen };
    }
    case "CLOSE_MENU": {
      return { ...state, isMenuOptionsOpen: false };
    }
    case "RESET_TEST": {
      return {
        ...state,
        index: 0,
        rightAnswersCounter: 0,
        mistakesMadeIn: {},
        isSummaryModalOpen: false,
        isMenuOptionsOpen: false,
        inProgress: true,
      };
    }
    default:
      return state;
  }
}
