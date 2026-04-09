import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ModalRootContainer } from "@widgets/modal";

const router = createBrowserRouter([
  ...routes.map((route) => ({
    path: route.path,
    element: route.element,
  })),
]);

export const App = () => (
  <Provider store={store}>
    <RouterProvider router={router} />
    <ModalRootContainer />
  </Provider>
);
