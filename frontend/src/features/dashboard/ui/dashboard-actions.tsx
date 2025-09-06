// import { actions } from "../model/action-button-model";
import type { IActionButtonProps } from "../model/types/action-interface";
import { ActionButton } from "./action";

type ActionsDashboardPropsType = {
  actions: IActionButtonProps[];
};

export const ActionsDashboard = ({ actions }: ActionsDashboardPropsType) => (
  <div className="flex flex-col items-center gap-5 text-center font-comic text-xl text-fuchsia-800 mt-20 my-auto">
    {actions.map((item) => (
      <ActionButton key={item.title} title={item.title} url={item.url} />
    ))}
  </div>
);
