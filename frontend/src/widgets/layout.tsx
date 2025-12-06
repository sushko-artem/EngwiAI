import { memo, type ReactNode } from "react";
import { Header, type HeaderPropType } from "./header";

interface ILayoutProps {
  children: ReactNode;
  headerProps: HeaderPropType;
}

export const Layout = memo(({ children, headerProps }: ILayoutProps) => {
  console.log("LAYOUT");
  return (
    <>
      <Header {...headerProps} />
      {children}
    </>
  );
});
