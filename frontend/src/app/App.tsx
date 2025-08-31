import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";

export const App = () => (
  <Provider store={store}>
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  </Provider>
);
