import { memo } from "react";
import { googleAuthRedirect } from "../utils";

export const GoogleAuth = memo(({ description }: { description: string }) => {
  const handleGoogleAuth = () => {
    googleAuthRedirect();
  };
  return (
    <button
      className="bg-amber-50 w-full rounded-[5px] border-1 p-2 flex hover:cursor-pointer"
      onClick={handleGoogleAuth}
    >
      <img
        className="w-[30px]"
        width={30}
        height={30}
        src="/google.svg"
        alt="google"
      />
      <span className="m-auto text-center">{description}</span>
    </button>
  );
});
