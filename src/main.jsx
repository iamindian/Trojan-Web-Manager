import './index.css'
import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/test",
    async lazy() {
      let App = await import("./App");
      return { Component: App };
    },
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
