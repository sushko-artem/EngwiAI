import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationButton } from "@features/dashboard/ui";
import type { ActionsType } from "@features/dashboard/lib";

export const ActionsDashboard = memo(
  ({ actions }: { actions: ActionsType }) => {
    const navigate = useNavigate();
    const hadleClick = (url: string) => {
      navigate(url);
    };

    return (
      <div className="flex flex-col items-center gap-5 text-center font-comic text-xl text-fuchsia-800 mt-10 my-auto">
        {actions.map((item) => {
          const actions = {
            title: item.title,
            url: item.url,
          };
          return (
            <NavigationButton
              actions={actions}
              key={item.title}
              onClick={hadleClick}
            />
          );
        })}
      </div>
    );
  }
);
