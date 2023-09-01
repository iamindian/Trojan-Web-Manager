import "./index.css";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider, useRouteError, isRouteErrorResponse, redirect, NavLink } from "react-router-dom";
import { Provider } from "react-redux";
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import configureStore from './configureStore'
import auth from './auth.js';

const store = configureStore();
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/admin",
        lazy: () => import("./pages/Admin"),
        loader: async () => {
          // await auth.signin(username, password);
          if (!auth.isAuthenticated) {
            return redirect("/login")
            // throw new Response("Not Found", { status: 404 });
          }
          return {}
        }
      },
      {
        index: true,
        lazy: () => import("./pages/App"),
      },
      {
        path:"/login",
        lazy: () => import("./pages/Login"),
      }
    ],
    errorElement: <RootBoundary />,
  },

]);
function RootBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <div>This page doesn't exist!</div>;
    }

    if (error.status === 401) {
      return <div>You aren't authorized to see this</div>;
    }

    if (error.status === 503) {
      return <div>Looks like our API is down</div>;
    }

    if (error.status === 418) {
      return <div>🫖</div>;
    }
  }

  return <div>Something went wrong</div>;
}

function Layout() {
  return (
    <div className="navigater">
      <div style={{ display: "flex", padding: "16px", width: "100%", position: "fixed", left: "0px", top: "0px" }}>
        <NavLink to="/" >Home</NavLink>
        <NavLink to="/admin">Admin</NavLink>
        <NavLink to="/login">Login</NavLink>
      </div>
      <div>
        <Outlet />
      </div>
    </div >
  )
}

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router}>

    </RouterProvider>
  </Provider>
);
