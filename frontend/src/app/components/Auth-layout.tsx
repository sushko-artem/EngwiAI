import { Outlet } from "react-router-dom";

export const AuthLayout = () => (
  <div className="flex-1 flex flex-col">
    <Outlet />
  </div>
);
