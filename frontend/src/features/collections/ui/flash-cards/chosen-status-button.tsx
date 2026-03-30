import { cn } from "@shared/lib/utils";

type ChosenStatusButtonPropType = {
  status: boolean;
  onClick(status: boolean): void;
  ClassName: string | undefined;
  content: string;
  children: React.ReactNode;
};

export const ChosenStatusButton = ({
  status,
  onClick,
  ClassName,
  content,
  children,
}: ChosenStatusButtonPropType) => {
  return (
    <div
      data-testid="chosen-status-button"
      onClick={() => onClick(status)}
      className={cn(
        "flex border-2 rounded-lg bg-[rgba(255,241,228,0.5)] active:bg-[rgba(255,241,228,0.2)] hover:shadow-[3px_5px_6px_rgba(0,0,0,0.3)] hover:scale-[1.01] cursor-pointer transition-all",
        ClassName,
      )}
    >
      <div className="p-2 my-auto w-[50px]">{children}</div>
      <span className="my-auto p-2 font-roboto font-bold">{content}</span>
    </div>
  );
};
