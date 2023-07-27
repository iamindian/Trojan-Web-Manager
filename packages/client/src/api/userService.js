import axios from "axios";
export async function getExpiration(username, password){
    return await axios.get('/api/expiration',{
        params:{
            username,
            password
        }
    })
}