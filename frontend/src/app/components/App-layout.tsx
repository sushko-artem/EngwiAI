import { Link, Outlet } from "react-router-dom";
import { ModalRootContainer } from "@widgets/modal";
import { useClearDraftLogic } from "@shared/hooks";

export const AppLayout = () => {
  useClearDraftLogic();
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 -z-10 backdrop-blur-[6px]"></div>
      <ModalRootContainer />

      <main className="flex-1 flex flex-col container mx-auto px-3 sm:px-4 lg:px-5 max-w-7xl">
        <Outlet />
      </main>

      <footer className="text-center text-sm text-gray-500 py-4">
        © 2027 EngwiAI.{" "}
        <Link to="/cookies" className="underline">
          Сookies policies
        </Link>
      </footer>
    </div>
  );
};
