import { memo } from "react";
import { googleAuthRedirect } from "../utils";
import googleIcon from "@assets/images/google.svg";
import { useModal } from "@widgets/modal";

export const GoogleAuth = memo(
  ({ description, provider }: { description: string; provider: boolean }) => {
    const { warning } = useModal();
    const handleGoogleAuth = () => {
      if (import.meta.env.DEV) {
        if (!provider) {
          warning(
            "Отсутствуют переменные GOOGLE_CLIENT_ID и GOOGLE_CLIENT_SECRET!",
          );
          return;
        }
      }
      googleAuthRedirect();
    };
    return (
      <button
        className="bg-amber-50 w-full rounded-[5px] border p-2 flex hover:cursor-pointer"
        onClick={handleGoogleAuth}
      >
        <img className="w-7.5" height={30} src={googleIcon} alt="google" />
        <span className="m-auto text-center">{description}</span>
      </button>
    );
  },
);
