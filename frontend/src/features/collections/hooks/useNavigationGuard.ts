import { useModal } from "@widgets/modal";
import { useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";

type UseNavigationGuardOptionType = {
  shouldBlock: boolean;
  confirmMessage: string;
  onProceed?: () => void;
  onReset?: () => void;
};

export const useNavigationGuard = ({
  shouldBlock,
  confirmMessage,
  onProceed,
  onReset,
}: UseNavigationGuardOptionType) => {
  const blocker = useBlocker(shouldBlock);
  const { confirm } = useModal();
  const blockerRef = useRef(blocker);
  blockerRef.current = blocker;

  useEffect(() => {
    async function handleBack() {
      if (blockerRef.current.state === "blocked") {
        const isBack = await confirm(confirmMessage);
        if (isBack) {
          onProceed?.();
          blockerRef.current.proceed();
        } else {
          onReset?.();
          blockerRef.current.reset();
        }
      }
    }
    handleBack();
  }, [blocker.state, confirm, onProceed, onReset, confirmMessage]);
};
