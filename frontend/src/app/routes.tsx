// import { Suspense } from "react";
// import { Loader } from "@shared/ui/loader";
import { AnimationPage } from "pages/StartAnimation";
import { SignInPage } from "pages/SignIn";
import { SignUpPage } from "pages/SignUp";
import { CreateCollectionPage } from "pages/CreateCollection";
import { FlashCardsPage } from "pages/FlashCards";

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
    path: "/flash-cards",
    element: <FlashCardsPage />,
  },
  {
    path: "/collections",
    element: <div>COLLECTIONS</div>,
  },
  {
    path: "/dashboard",
    element: <div>DASHBOARD</div>,
  },
  {
    path: "*",
    element: <div>"Not Found"</div>,
  },
];

export default routes;
