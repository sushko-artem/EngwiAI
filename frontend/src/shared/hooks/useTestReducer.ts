import { useCallback, useReducer } from "react";
import { initialState, testReducer } from "./reducers/testReducer";

export const useTestReducer = () => {
  const [state, dispatch] = useReducer(testReducer, initialState);

  const handleAnswer = useCallback(
    (payload: {
      testLength: number;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
    }) => {
      dispatch({
        type: "HANDLE_ANSWER",
        payload,
      });
    },
    [],
  );

  const toggleMenu = useCallback(() => {
    dispatch({ type: "TOGGLE_MENU" });
  }, []);

  const closeMenu = useCallback(() => {
    dispatch({ type: "CLOSE_MENU" });
  }, []);

  const resetTest = useCallback(() => {
    dispatch({ type: "RESET_TEST" });
  }, []);

  return {
    state,
    handleAnswer,
    toggleMenu,
    closeMenu,
    resetTest,
    testInProgress: state.index > 0 && state.inProgress,
  };
};
