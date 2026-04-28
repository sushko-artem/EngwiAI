import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const router = createBrowserRouter(routes);

export const App = () => (
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
