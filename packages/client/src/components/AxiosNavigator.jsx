import {useEffect, useRef } from "react";
import axios from "axios";
import{useNavigate} from "react-router-dom"
function AxiosNavigator(props){
    const navRef = useRef(useNavigate());
    useEffect(() => {
        const intercetpor = axios.interceptors.response.use(
          (response) => response,
          (error) => {
            switch (error?.response?.status) {
              case 401:
                navRef.current('/login');
                break;
              default:
            }
            return Promise.reject(error);
          }
        );
        return () => {
          axios.interceptors.response.eject(intercetpor);
        };
      }, []);
    return <div></div>
}
export default AxiosNavigator