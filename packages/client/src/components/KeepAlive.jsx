import { useEffect, useState } from "react"
import { signin } from "../api/userService"
import auth from "../auth"
function KeepAlive(props) {
    let [timer, setTimer] = useState()
    async function ping() {
        clearTimeout(timer);
        if(sessionStorage.getItem("isAuthenticated")){
            try{
                await signin("","")
            }catch(e){
                console.error(e)
            }
        }
        setTimer(setTimeout( () => {
            ping();
        }, 60000))
    }
    useEffect(() => {
        ping()
        return () => {
            clearTimeout(timer)
        }
    }, [])
    return <div>{props.children}</div>
}
export default KeepAlive