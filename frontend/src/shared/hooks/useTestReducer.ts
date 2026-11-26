import { useCallback, useEffect, useReducer, useState } from "react";
import { initialState, testReducer } from "./reducers/testReducer";
import { compareUserAnswer } from "@shared/helpers";
import type { SoundNameType } from "@shared/constants/sounds";
import { useSound } from "@shared/hooks";

export const useTestReducer = (testLength: number | undefined) => {
  const [state, dispatch] = useReducer(testReducer, initialState);
  const { play, toggleGroup, isGroupMuted } = useSound();
  const [borderType, setBorderType] = useState<SoundNameType | null>(null);

  useEffect(() => {
    if (testLength) dispatch({ type: "SET_LENGTH", payload: { testLength } });
  }, [dispatch, testLength]);

  useEffect(() => {
    setBorderType(null);
  }, [state.index]);

  const handleAnswer = useCallback(
    (userAnswer: string, correctAnswer: string) => {
      const status = compareUserAnswer(userAnswer, correctAnswer);
      setBorderType(status);
      play(status);
      const isCorrect = status === "correct";
      const payload = { userAnswer, correctAnswer, isCorrect };
      dispatch({
        type: "HANDLE_ANSWER",
        payload,
      });
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
    borderType,
    handleAnswer,
    toggleMenu,
    toggleGroup,
    isGroupMuted,
    closeMenu,
    resetTest,
    testInProgress: state.index > 0 && state.inProgress,
  };
};
