import { useEffect } from "react";

export const usePreventReload = (shouldPrevent: boolean) => {
  useEffect(() => {
    if (!shouldPrevent) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldPrevent]);
};
