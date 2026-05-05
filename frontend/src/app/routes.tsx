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
      {
        path: "/create-collection",
        element: (
          <ProtectedRoute>
            <CreateCollectionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/flash-cards/:collectionId",
        element: (
          <ProtectedRoute>
            <FlashCardsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit-collection/:collectionId",
        element: (
          <ProtectedRoute>
            <EditCollectionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/collections",
        element: (
          <ProtectedRoute>
            <CollectionsListPage />
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
        path: "/interval-learning",
        element: (
          <ProtectedRoute>
            <IntervalLearningPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/spell-check",
        element: (
          <ProtectedRoute>
            <SpellCheckingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/spell-check/test",
        element: (
          <ProtectedRoute>
            <SpellCheckTestPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/test-report",
        element: (
          <ProtectedRoute>
            <TestReportPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

export default routes;
