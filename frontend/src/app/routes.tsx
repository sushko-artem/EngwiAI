// import { Suspense } from "react";
// import { Loader } from "@shared/ui/loader";
import { AnimationPage } from "pages/StartAnimation";
import { SignInPage } from "pages/SignIn";
import { SignUpPage } from "pages/SignUp";
import { CreateCollectionPage } from "pages/CreateCollection";

const routes = [
  {
    path: "/",
    element: <AnimationPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/create-collection",
    element: <CreateCollectionPage />,
  },
  {
    path: "*",
    element: <div>"Not Found"</div>,
  },
];

export default routes;
