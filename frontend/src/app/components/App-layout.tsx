import { Outlet } from "react-router-dom";
import { ModalRootContainer } from "@widgets/modal";
import { useClearDraftLogic } from "@shared/hooks";

export const AppLayout = () => {
  useClearDraftLogic();
  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-5 max-w-7xl">
      <div className="fixed inset-0 -z-10 backdrop-blur-[6px]"></div>
      <ModalRootContainer />
      <Outlet />
    </div>
  );
};
