import { memo } from "react";

export const BottomAuthLayout = memo(
  ({ google, link }: { google: React.ReactNode; link: React.ReactNode }) => (
    <div className="flex flex-col w-full">
      {google}
      {link}
    </div>
  )
);
