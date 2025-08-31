import { memo } from "react";

export const GoogleAuth = memo(({ description }: { description: string }) => {
  return (
    <button
      className="bg-amber-50 w-full rounded-[5px] border-1 p-2 flex hover:cursor-pointer"
      onClick={() => {
        console.log("GoogleAuth");
      }}
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
