import logout from "@assets/images/logout.svg";
import logo from "@assets/images/logo.png";
import { ActionsDashboard, Layout } from "@widgets/index";
import { actions } from "./lib/actions-config";
import { useLogOutMutation } from "@features/auth";
import { useCallback } from "react";

export const DashboardPage = () => {
  const [logOut] = useLogOutMutation();

  const handleLogOut = useCallback(async () => {
    logOut().unwrap().catch(console.error);
  }, [logOut]);

  return (
    <Layout
      headerProps={{
        title: "EngwiAI",
        leftIcon: logo,
        rightIcon: logout,
        leftIconTitle: "EngwiAI",
        rightIconTitle: "Выйти из приложения",
        leftIconAction: () => {},
        rightIconAction: handleLogOut,
      }}
    >
      <ActionsDashboard actions={actions} />
    </Layout>
  );
};
