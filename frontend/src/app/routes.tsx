import { AnimationPage } from "@pages/StartAnimation";
import { SignInPage } from "@pages/SignIn";
import { SignUpPage } from "@pages/SignUp";
import { CreateCollectionPage } from "@pages/CreateCollection";
import { FlashCardsPage } from "@pages/FlashCards";
import { DashboardPage } from "@pages/Dashboard";
import { CollectionsListPage } from "@pages/Collections";
import { ProtectedRoute } from "@shared/protected-route";
import { EditCollectionPage } from "@pages/EditCollection";
import { IntervalLearningPage } from "@pages/IntervalLearning";
import { SpellCheckingPage } from "@pages/SpellChecking";
import { AppLayout } from "./components/app-layout";
import { SpellCheckTestPage } from "@pages/SpellCheckTest";
import { TestReportPage } from "@pages/TestReport";
import { NotFoundPage } from "@widgets/not-found-page";
import { GrammarCheckingPage } from "@pages/GrammarChecking";
import { GrammarTestPage } from "@pages/GrammarTest";

const protectedRoutes = [
  {
    path: "/create-collection",
    element: <CreateCollectionPage />,
  },
  {
    path: "/flash-cards/:collectionId",
    element: <FlashCardsPage />,
  },
  {
    path: "/edit-collection/:collectionId",
    element: <EditCollectionPage />,
  },
  {
    path: "/collections",
    element: <CollectionsListPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/interval-learning",
    element: <IntervalLearningPage />,
  },
  {
    path: "/spell-check",
    element: <SpellCheckingPage />,
  },
  {
    path: "/spell-check/test",
    element: <SpellCheckTestPage />,
  },
  {
    path: "/grammar-check",
    element: <GrammarCheckingPage />,
  },
  {
    path: "/grammar-test",
    element: <GrammarTestPage />,
  },
  {
    path: "/test-report",
    element: <TestReportPage />,
  },
].map((route) => ({
  ...route,
  element: <ProtectedRoute>{route.element}</ProtectedRoute>,
}));

const routes = [
  {
    element: <AppLayout />,
    children: [
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
      ...protectedRoutes,
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

export default routes;
