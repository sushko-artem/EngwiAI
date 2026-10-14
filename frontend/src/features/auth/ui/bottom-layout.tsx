import { memo } from "react";
import { GoogleAuth } from "./google-auth-button";
import { AuthLink } from "./link";

export const BottomAuthLayout = memo(
  ({
    buttonText,
    linkText,
    url,
    provider,
  }: {
    buttonText: string;
    linkText: string;
    url: string;
    provider: boolean;
  }) => (
    <div className="flex flex-col w-full">
      <GoogleAuth provider={provider} description={buttonText} />
      <AuthLink text={""} url={url} linkText={linkText} />
    </div>
  ),
);
