import { useState } from "React";
import axios from "axios";
const prefix = import.meta.env.VITE_API_PREFIX;
function useGetUsers() {
    const [status, setLoading] = useState("loaded");
    async function getUsers(offset, limit) {
        setLoading("loading")
        return await axios.get(`${prefix}/users`, { params: { offset, limit } }).then((resp) => {
            setLoading("loaded");
            return resp;
        }).catch(e => {
            console.error(e);
            setLoading("loaded")
            throw e;
        })
    }
    return [status, getUsers]
}
export default useGetUsers;