import { memo } from "react";
import type { IActionButtonProps } from "../model/types/action-interface";
import { ActionButton } from "./actionButton";

type ActionsDashboardPropsType = {
  actions: IActionButtonProps[];
};

export const ActionsDashboard = memo(
  ({ actions }: ActionsDashboardPropsType) => (
    <div className="flex flex-col items-center gap-5 text-center font-comic text-xl text-fuchsia-800 mt-10 my-auto">
      {actions.map((item) => (
        <ActionButton key={item.title} title={item.title} url={item.url} />
      ))}
    </div>
  )
);
