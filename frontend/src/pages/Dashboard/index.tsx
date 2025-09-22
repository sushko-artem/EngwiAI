import { memo } from "react";
import { Header } from "@widgets/header";
import logout from "@assets/images/logout.svg";
import logo from "@assets/images/logo.png";
import { ActionsDashboard } from "@widgets/dashboardActions/ui/dashboard-actions";
import { actions } from "./lib/actions-config";
import { useAuth } from "@features/auth/hooks";

export const DashboardPage = memo(() => {
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
