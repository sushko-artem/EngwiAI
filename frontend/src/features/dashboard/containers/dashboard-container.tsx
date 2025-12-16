import { useCallback, useMemo } from "react";
import logout from "@assets/images/logout.svg";
import logo from "@assets/images/logo.png";
import { ActionsDashboard } from "@features/dashboard/ui";
import { actions } from "@features/dashboard/lib";
import { useLogOutMutation } from "@features/auth";
import { Header } from "@widgets/header";

export const DashboardContainer = () => {
  const [logOut] = useLogOutMutation();

  const handleLogOut = useCallback(async () => {
    logOut().unwrap().catch(console.error);
  }, [logOut]);

  const dashboardHeaderProps = useMemo(
    () => ({
      title: "EngwiAI",
      leftIcon: logo,
      rightIcon: logout,
      leftIconTitle: "EngwiAI",
      rightIconTitle: "Выйти из приложения",
      leftIconAction: () => {},
      rightIconAction: handleLogOut,
    }),
    [handleLogOut]
  );

  return (
    <>
      <Header {...dashboardHeaderProps} />
      <ActionsDashboard actions={actions} />
    </>
  );
};
