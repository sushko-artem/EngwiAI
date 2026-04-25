import { compareUserAnswer } from "@features/collections/helpers";

type SpellTestStateType = {
  index: number;
  rightAnswersCounter: number;
  mistakesMadeIn: Record<string, string>;
  isSummaryModalOpen: boolean;
  inProgress: boolean;
};

type SpellTestActionsType =
  | {
      type: "HANDLE_ANSWER";
      payload: {
        collectionLength: number;
        userAnswer: string;
        originalValue: string;
      };
    }
  | { type: "RESET_TEST" };

export const initialState: SpellTestStateType = {
  index: 0,
  rightAnswersCounter: 0,
  mistakesMadeIn: {},
  isSummaryModalOpen: false,
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
        originalValue,
      } = action.payload;

      const isRight = compareUserAnswer(userAnswer, originalValue);

      const newState = { ...state };

      if (!isRight) {
        newState.mistakesMadeIn = {
          ...newState.mistakesMadeIn,
          [originalValue]: userAnswer,
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
    case "RESET_TEST": {
      return {
        ...state,
        index: 0,
        rightAnswersCounter: 0,
        mistakesMadeIn: {},
        isSummaryModalOpen: false,
        inProgress: true,
      };
    }
    default:
      return state;
  }
}
