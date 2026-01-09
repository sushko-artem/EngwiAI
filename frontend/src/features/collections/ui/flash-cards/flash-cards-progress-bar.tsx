import { Progress } from "@shared/ui/progress";
import { memo } from "react";

export const ProgressBar = memo(
  ({ value, index }: { value: number; index: number }) => {
    return (
      <div className="mt-3 m-auto max-w-[350px] md:max-w-[500px] text-center text-sm font-comic">
        <Progress
          className="bg-transparent"
          value={((index + 1) / value) * 100}
        />
        <span>
          {index + 1}/{value}
        </span>
      </div>
    );
  }
);
