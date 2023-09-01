import "./index.css";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { defer, createBrowserRouter, Outlet, RouterProvider, useRouteError, isRouteErrorResponse, redirect, NavLink } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from './configureStore'
import AxiosNavigator from './components/AxiosNavigator'
import KeepAlive from "./components/Keepalive";
import TwmAlert from "./components/TwmAlert";
import axios from "axios";
import { useSnackbar } from '@mui/base/useSnackbar';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { css, keyframes, styled } from '@mui/system';
const prefix = import.meta.env.VITE_API_PREFIX;
const store = configureStore();
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [

      {
        path: "/admin/:id?",
        lazy: () => import("./pages/Admin"),
        loader: async ({ params }) => {
          // await auth.signin(username, password);
          if (!sessionStorage.getItem("isAuthenticated")) {
            return redirect("/login")
            // throw new Response("Not Found", { status: 404 });
          }
          const { id } = params;
          if (!id) {
            return defer({
              userPromise: Promise.resolve(
                {
                  data: {
                    users: [{
                      username: "",
                    }],
                    total: 1,
                  }
                }
              )
            });
          }
          try {
            const userPromise = axios.get(`${prefix}/users`, { params: { offset: 0, limit: 1, id } });
            return defer({
              userPromise
            })
          } catch (e) {
            if (e.response.status === 401) {
              return redirect("/login")
            } else {
              throw e;
            }

          }



        }
      },
      {
        index: true,
        lazy: () => import("./pages/App"),
      },
      {
        path: "/login",
        lazy: () => import("./pages/Login"),
      },
      {
        path: "/users",
        lazy: () => import("./pages/Users"),
        loader: async () => {
          if (!sessionStorage.getItem("isAuthenticated")) {
            return redirect("/login")
          }
          return {}
        }
      },
    ],
    // errorElement: <RootBoundary />,
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

  return <div>something wrong</div>;
}

function Layout() {
  const blue = {
    200: '#99CCF3',
    400: '#3399FF',
    500: '#007FFF',
  };

  const grey = {
    50: '#f6f8fa',
    100: '#eaeef2',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f',
  };

  const snackbarInRight = keyframes`
    from {
      transform: translateX(100%);
    }
  
    to {
      transform: translateX(0);
    }
  `;
  const CustomSnackbar = styled('div')(
    ({ theme }) => css`
      position: fixed;
      z-index: 5500;
      display: flex;
      right: 16px;
      bottom: 16px;
      left: auto;
      justify-content: start;
      max-width: 560px;
      min-width: 300px;
      background-color: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
      border-radius: 8px;
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      box-shadow: ${theme.palette.mode === 'dark'
        ? `0 2px 8px rgb(0 0 0 / 0.5)`
        : `0 2px 8px ${grey[200]}`};
      padding: 0.75rem;
      color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 600;
      animation: ${snackbarInRight} 200ms;
      transition: transform 0.2s ease-out;
    `,
  );
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const { getRootProps, onClickAway } = useSnackbar({
    onClose: closeAlert,
    open,
    autoHideDuration: 5000,
  });
  function openAlert(content) {
    setOpen(true);
    setContent(content);
  }
  function closeAlert() {
    setOpen(false);
  }

  return (
    <div className="navigater">
      <div style={{ display: "flex", paddingTop: "16px", width: "100%", position: "fixed", left: "0px", top: "0px" }}>
        <NavLink to="/" >Home</NavLink>
        {/* <NavLink to="/admin">Admin</NavLink> */}
        <NavLink to="/users">Users</NavLink>
      </div>
      <div>
        <Outlet context={{ openAlert }} />
      </div>
      <AxiosNavigator></AxiosNavigator>
      {open ? <ClickAwayListener onClickAway={onClickAway}>
        <CustomSnackbar {...getRootProps()}>{content}</CustomSnackbar>
      </ClickAwayListener> : null}

    </div >
  )
}

createRoot(document.getElementById("root")).render(
  <KeepAlive>
    <Provider store={store}>
      <RouterProvider router={router}>

      </RouterProvider>
    </Provider>
  </KeepAlive>
);
