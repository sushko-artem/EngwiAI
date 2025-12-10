import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { IActionButtonProps } from "../types/action-interface";

export const ActionButton = memo(({ title, url }: IActionButtonProps) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(url);
  }, [url, navigate]);

  return (
    <div
      onClick={handleClick}
      className="w-[70%] md:w-[40%] border-2 p-4 rounded-md cursor-pointer border-gray-500 hover:shadow-[5px_5px_7px_rgba(0,0,0,0.5)] hover:scale-[1.05] transition-all active:border-gray-400"
    >
      <span>{title}</span>
    </div>
  );
});
