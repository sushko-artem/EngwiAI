import { useCallback, useEffect, useReducer } from "react";
import { initialState, testReducer } from "./reducers/testReducer";
import { useSound } from "./useSound";
import { compareUserAnswer } from "@shared/helpers";

export const useTestReducer = (testLength: number | undefined) => {
  const [state, dispatch] = useReducer(testReducer, initialState);
  const { play } = useSound();

  useEffect(() => {
    if (testLength) dispatch({ type: "SET_LENGTH", payload: { testLength } });
  }, [dispatch, testLength]);

  const handleAnswer = useCallback(
    (userAnswer: string, correctAnswer: string) => {
      const status = compareUserAnswer(userAnswer, correctAnswer);
      play(status);
      const isCorrect = status === "correct";
      const payload = { userAnswer, correctAnswer, isCorrect };
      dispatch({
        type: "HANDLE_ANSWER",
        payload,
      });
      return status;
    },
    [dispatch, play],
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
