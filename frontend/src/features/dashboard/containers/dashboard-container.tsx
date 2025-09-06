import { memo } from "react";
import { Header } from "@shared/ui/header";
import logout from "@assets/images/logout.svg";
import logo from "@assets/images/logo.png";
import { ActionsDashboard } from "../ui/dashboard-actions";
import { actions } from "../model/action-button-model";
import { useAuth } from "@features/auth/hooks";

export const Dashboard = memo(() => {
  const { logOut } = useAuth();

  return (
    <>
      <Header
        title="EngwiAI"
        leftIcon={logo}
        rightIcon={logout}
        leftIconTitle="EngwiAI"
        rightIconTitle="Выйти из приложения"
        leftIconAction={() => {}}
        rightIconAction={logOut}
      />
      <ActionsDashboard actions={actions} />
    </>
  );
});
