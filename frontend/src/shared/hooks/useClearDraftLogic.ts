import { clearCollection } from "@entities/collection/model";
import { useAppDispatch } from "@redux/hooks";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const isCollectionsDraftPath = (s: string) => /\/(edit|create)/.test(s);
const isGrammarDraftPath = (s: string) => /\/grammar-test/.test(s);

export const useClearDraftLogic = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const prev = prevPathRef.current;
    const next = pathname;
    prevPathRef.current = pathname;

    if (isCollectionsDraftPath(prev) && !isCollectionsDraftPath(next)) {
      dispatch(clearCollection());
    }

    if (isGrammarDraftPath(prev) && !isGrammarDraftPath(next)) {
      sessionStorage.removeItem("grammar_test_cache");
      sessionStorage.setItem("grammar_test_completed", "true");
    }
  }, [pathname, dispatch]);
};
