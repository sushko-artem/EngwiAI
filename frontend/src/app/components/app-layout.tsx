import { ModalRootContainer } from "@widgets/modal";
import { ClearDraftLogic } from "./clear-draft-logic";
import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <>
      <ClearDraftLogic />
      <ModalRootContainer />
      <Outlet />
    </>
  );
};
