import { useEffect } from "react";

export const usePreventReload = (shouldPrevent: boolean) => {
  useEffect(() => {
    if (!shouldPrevent) return;

    const handleBeforaUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforaUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforaUnload);
    };
  }, [shouldPrevent]);
};
