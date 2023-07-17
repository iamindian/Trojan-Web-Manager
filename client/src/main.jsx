import "./index.css";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from './configureStore'
const store = configureStore();
const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => import("./pages/App"),
  },
]);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router}>
      <Outlet />
    </RouterProvider>
  </Provider>
);
