import { memo } from "react";

type ChooseModuleActionPropType = {
  children: React.ReactNode;
  id: string;
  onClick(id: string): void;
  isChosen: boolean;
};

export const ChooseModuleAction = memo(
  ({ children, id, onClick, isChosen }: ChooseModuleActionPropType) => {
    return (
      <div
        data-testid="chosen-module"
        onClick={() => onClick(id)}
        className={`mt-1 mb-1 p-1 border-2 border-gray-500 rounded-[5px] cursor-pointer font-bold text-cyan-900 hover:shadow-[5px_5px_7px_rgba(0,0,0,0.5)] hover:scale-[1.02] transition-all ${isChosen ? "bg-[radial-gradient(circle,rgba(255,255,255,0)_0%,rgba(199,159,119,0.8)_61%)]" : null}`}
      >
        {children}
      </div>
    );
  },
);
