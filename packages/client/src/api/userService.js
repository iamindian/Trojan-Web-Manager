import axios from "axios";
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
export async function getUser(username){
    return await axios.get(`${prefix}/user`,{
        params:{
            username,
        }
    })
}