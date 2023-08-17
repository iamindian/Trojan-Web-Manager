import axios from "axios";
import {useNavigate} from "react-router-dom";
const prefix = import.meta.env.VITE_API_PREFIX;
export async function signin(username, password){
    return await axios.get(`${prefix}/signin`,{
        params:{
            username,
            password
        }
    })
}
export async function getExpiration(username, password){
    return await axios.get(`${prefix}/expiration`,{
        params:{
            username,
            password
        }
    })
}
export async function extend(username, password,quantity){
    return await axios.get(`${prefix}/extend`,{
        params:{
            username,
            password,
            quantity
        }
    })
}