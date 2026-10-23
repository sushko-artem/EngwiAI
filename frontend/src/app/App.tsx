import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useOverlayScrollbars } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import { useEffect } from "react";

const router = createBrowserRouter(routes);

export const App = () => {
  const [initialize] = useOverlayScrollbars({
    options: {
      scrollbars: {
        theme: "os-theme-custom",
        autoHide: "leave",
        clickScroll: true,
      },
    },
    defer: true,
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-overlayscrollbars-initialize",
      "",
    );
    document.body.setAttribute("data-overlayscrollbars-initialize", "");

    initialize(document.body);
  }, [initialize]);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};
