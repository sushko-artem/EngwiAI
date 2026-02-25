import { memo } from "react";
import { GoogleAuth } from "./google-auth-button";
import { AuthLink } from "./link";

export const BottomAuthLayout = memo(
  ({
    buttonText,
    linkText,
    url,
  }: {
    buttonText: string;
    linkText: string;
    url: string;
  }) => (
    <div className="flex flex-col w-full">
      <GoogleAuth description={buttonText} />
      <AuthLink text={""} url={url} linkText={linkText} />
    </div>
  )
);
