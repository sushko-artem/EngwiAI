import { useCallback, useMemo } from "react";
import logout from "@assets/images/logout.svg";
import logo from "@assets/images/logo_project.webp";
import title from "@assets/images/title.png";
import { ActionsDashboard } from "@features/dashboard/ui";
import { actions } from "@features/dashboard/lib";
import { useLogOutMutation } from "@features/auth";
import { Header } from "@widgets/header";
import { useModal } from "@widgets/modal";

export const DashboardContainer = () => {
  const [logOut] = useLogOutMutation();
  const { confirm } = useModal();

  const handleLogOut = useCallback(async () => {
    const isLogOut = await confirm("Выйти из приложения?");
    if (!isLogOut) return;
    logOut().unwrap().catch(console.error);
  }, [logOut, confirm]);

  const dashboardHeaderProps = useMemo(
    () => ({
      title: <img src={title} alt="title" width={200} height={100} />,
      leftIcon: logo,
      rightIcon: logout,
      leftIconTitle: "EngwiAI",
      rightIconTitle: "Выйти из приложения",
      leftIconAction: () => {},
      rightIconAction: handleLogOut,
    }),
    [handleLogOut],
  );

  return (
    <>
      <Header {...dashboardHeaderProps} />
      <ActionsDashboard actions={actions} />
    </>
  );
};
