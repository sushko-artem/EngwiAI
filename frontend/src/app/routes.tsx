// import { Suspense } from "react";
// import { Loader } from "@shared/ui/loader";
import { AnimationPage } from "pages/StartAnimation";
import { SignInPage } from "pages/SignIn";
import { SignUpPage } from "pages/SignUp";
import { CreateCollectionPage } from "pages/CreateCollection";
import { FlashCardsPage } from "pages/FlashCards";
import { DashboardPage } from "pages/Dashboard";
import { CollectionPage } from "pages/Collections";
import { ProtectedRoute } from "@shared/protected-route";

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
    element: (
      <ProtectedRoute>
        <CreateCollectionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/flash-cards",
    element: (
      <ProtectedRoute>
        <FlashCardsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/collections",
    element: (
      <ProtectedRoute>
        <CollectionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <div>"Error 404! Страница не найдена!"</div>,
  },
];

export default routes;
