import { useLocation, useNavigate } from "react-router-dom";
import { useGetCardsFromCollectionsMutation } from "../api/collections-api";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import type { ICard } from "@shared/api";
import { initialState, spellTestReducer } from "./reducers/useSpellTestReducer";
import { compareUserAnswer } from "../helpers";
import { useModal } from "@widgets/modal";
import { useBlocker } from "react-router-dom";

export const useSpellTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirm } = useModal();
  const [getCards, { isLoading, error }] = useGetCardsFromCollectionsMutation();
  const [state, dispatch] = useReducer(spellTestReducer, initialState);
  const [collection, setCollection] = useState<ICard[]>([]);
  const index = useRef(state.index);
  index.current = state.index;
  const testInProgress = index.current > 0 && index.current < collection.length;
  const blocker = useBlocker(testInProgress);
  const blockerRef = useRef(blocker);
  blockerRef.current = blocker;

  useEffect(() => {
    async function handleBack() {
      if (blockerRef.current.state === "blocked") {
        const isBack = await confirm(
          "Покинуть страницу? Данные теста сохранены не будут!",
        );
        if (isBack) {
          blockerRef.current.proceed();
        } else {
          blockerRef.current.reset();
        }
      }
    }
    handleBack();
  }, [blocker.state, confirm]);

  useEffect(() => {
    if (!location.state?.modules) {
      navigate("/spell-check");
      return;
    }
    async function getCardsFromCollections() {
      try {
        const result = await getCards({
          collectionIds: location.state.modules,
        }).unwrap();
        setCollection(result);
      } catch (err) {
        console.error("Failed to load cards:", err);
        navigate("/spell-check");
      }
    }
    getCardsFromCollections();
  }, [navigate, location.state?.modules, getCards]);

  const handleAnswer = useCallback(
    (userAnswer: string, originalValue: string) => {
      const isRight = compareUserAnswer(userAnswer, originalValue);
      console.log(isRight);
      if (state.index + 1 === collection.length) return;
      dispatch({ type: "INCREMENT_INDEX" });
    },
    [state.index, collection.length],
  );

  return {
    collection,
    isLoading,
    error,
    getCards,
    index: state.index,
    handleAnswer,
    visibleSide: location.state.visibleSide,
  };
};
