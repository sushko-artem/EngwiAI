import { ModalRootContainer } from "@widgets/modal";
import { ClearDraftLogic } from "./clear-draft-logic";
import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-5 max-w-7xl">
      <div className="fixed inset-0 -z-10 backdrop-blur-[6px]"></div>
      <ClearDraftLogic />
      <ModalRootContainer />
      <Outlet />
    </div>
  );
};
