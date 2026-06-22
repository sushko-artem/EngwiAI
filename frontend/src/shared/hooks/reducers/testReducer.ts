type TestStateType = {
  testLength: number;
  index: number;
  rightAnswersCounter: number;
  mistakesMadeIn: Record<string, string>;
  isMenuOptionsOpen: boolean;
  isSummaryModalOpen: boolean;
  inProgress: boolean;
};

type TestActionsType =
  | { type: "SET_LENGTH"; payload: { testLength: number } }
  | {
      type: "HANDLE_ANSWER";
      payload: {
        userAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
      };
    }
  | { type: "RESET_TEST" }
  | { type: "TOGGLE_MENU" }
  | { type: "CLOSE_MENU" };

export const initialState: TestStateType = {
  testLength: 0,
  index: 0,
  rightAnswersCounter: 0,
  mistakesMadeIn: {},
  isSummaryModalOpen: false,
  isMenuOptionsOpen: false,
  inProgress: true,
};

export function testReducer(
  state: TestStateType,
  action: TestActionsType,
): TestStateType {
  switch (action.type) {
    case "SET_LENGTH": {
      return { ...state, testLength: action.payload.testLength };
    }
    case "HANDLE_ANSWER": {
      const { userAnswer, correctAnswer, isCorrect } = action.payload;

      const newState = { ...state };

      if (!isCorrect) {
        newState.mistakesMadeIn = {
          ...newState.mistakesMadeIn,
          [correctAnswer]: userAnswer,
        };
      } else {
        newState.rightAnswersCounter += 1;
      }

      if (newState.index === newState.testLength - 1) {
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
