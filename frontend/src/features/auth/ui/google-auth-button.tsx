import { AUTH_ENDPOINTS } from "@shared/api";
import { memo, useCallback } from "react";

export const GoogleAuth = memo(({ description }: { description: string }) => {
  const handleGoogleAuth = useCallback(() => {
    const baseUrl = import.meta.env.VITE_API_URL;
    window.location.href = `${baseUrl}${AUTH_ENDPOINTS.GOOGLE_AUTH}`;
  }, []);
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
