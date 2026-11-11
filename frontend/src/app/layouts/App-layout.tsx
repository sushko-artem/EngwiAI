import { Outlet } from "react-router-dom";
import { ModalRootContainer, useModal } from "@widgets/modal";
import { useClearDraftLogic } from "@shared/hooks";
import { memo, useCallback } from "react";

const Footer = memo(({ onPolicyClick }: { onPolicyClick: () => void }) => (
  <footer className="text-center text-sm text-gray-500 py-4">
    © 2027 EngwiAI.{" "}
    <span onClick={onPolicyClick} className="underline cursor-pointer">
      Cookies policies
    </span>
  </footer>
));

export const AppLayout = () => {
  const { warning } = useModal();
  useClearDraftLogic();

  const showPolicy = useCallback(() => {
    warning(
      "Мы используем технически необходимые cookies для обеспечения работы функции авторизации и сохранения вашей сессии. Эти cookies не используются для аналитики или рекламы",
    );
  }, [warning]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 -z-10 backdrop-blur-[6px]"></div>
      <ModalRootContainer />

      <main className="flex-1 flex flex-col container mx-auto px-3 sm:px-4 lg:px-5 max-w-7xl">
        <Outlet />
      </main>

      <Footer onPolicyClick={showPolicy} />
    </div>
  );
};
