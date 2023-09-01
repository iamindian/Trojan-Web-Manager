
import { useEffect, useState, useRef,Fagment} from "react";
import { useSnackbar } from '@mui/base/useSnackbar';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { css, keyframes, styled } from '@mui/system';
import AxiosNavigator from './AxiosNavigator'
import { NavLink, Outlet } from 'react-router-dom';
function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState("false");
  const listener = useRef(null);
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
  function updateAuthenticated(){
    setIsAuthenticated(sessionStorage.getItem("isAuthenticated")); 
  }
  useEffect(()=>{
    listener.current = window.addEventListener('storage',updateAuthenticated);
    window.dispatchEvent( new Event('storage') ) 
    return ()=>{
      window.removeEventListener('storage', updateAuthenticated);
    }
  },[isAuthenticated])
  return (
    <div className="navigater">
      <div style={{ display: "flex", paddingTop: "16px", width: "100%", position: "fixed", left: "0px", top: "0px" }}>
        <NavLink to="/" >Query</NavLink>
        {isAuthenticated == "true" ? <NavLink to="/admin" end>Add</NavLink> : ""}
        {isAuthenticated == "true" ? <NavLink to="/users" end>Users</NavLink> : ""}
        {/* {isAuthenticated == "true" ? <NavLink to="/grid" end>Grid</NavLink> : ""} */}
        {isAuthenticated == "true" ? "" : <NavLink to="/login" end>Login</NavLink>}
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
export default Layout;