// import { Suspense } from "react";
// import { Loader } from "@shared/ui/loader";
import { AnimationPage } from "pages/StartAnimation";
import { SignInPage } from "pages/SignIn";
import { SignUpPage } from "pages/SignUp";
import { CreateCollectionPage } from "pages/CreateCollection";
import { FlashCardsPage } from "pages/FlashCards";
import { DashboardPage } from "pages/Dashboard";
import { CollectionList } from "@features/collectionList";

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
    element: <CollectionList />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "*",
    element: <div>"Error 404! Страница не найдена!"</div>,
  },
];

export default routes;
