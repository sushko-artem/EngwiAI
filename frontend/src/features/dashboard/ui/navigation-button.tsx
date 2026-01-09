import type { ActionsType } from "@features/dashboard/lib";

type ActionButtonPropsType = {
  actions: ActionsType[number];
  onClick(url: string): void;
};

export const NavigationButton = ({
  actions: { title, url },
  onClick,
}: ActionButtonPropsType) => (
  <div
    onClick={() => onClick(url)}
    className="w-[70%] md:w-[40%] border-2 p-4 rounded-md cursor-pointer border-gray-500 hover:shadow-[5px_5px_7px_rgba(0,0,0,0.5)] hover:scale-[1.05] transition-all active:border-gray-400"
  >
    <span>{title}</span>
  </div>
);
