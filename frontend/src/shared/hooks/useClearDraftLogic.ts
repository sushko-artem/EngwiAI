import { clearCollection } from "@entities/collection/model";
import { useAppDispatch } from "@redux/hooks";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const useClearDraftLogic = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const wasOnEditPage = /\/(edit|create)/.test(prevPathRef.current);
    const isOnEditPage = /\/(edit|create)/.test(location.pathname);
    const wasOnGrammarTestPage = /\/(grammar-test)/.test(prevPathRef.current);
    const isOnGrammarTestPage = /\/(grammar-test)/.test(location.pathname);

    if (wasOnEditPage && !isOnEditPage) {
      dispatch(clearCollection());
    }

    if (wasOnGrammarTestPage && !isOnGrammarTestPage) {
      sessionStorage.removeItem("grammar_test_cache");
    }

    prevPathRef.current = location.pathname;
  }, [location.pathname, dispatch]);
};
