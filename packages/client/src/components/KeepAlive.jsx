import { useEffect, useState } from "react"
import { signin } from "../api/userService"
import auth from "../auth"
function KeepAlive(props) {
    let [timer, setTimer] = useState()
    async function ping() {
        clearTimeout(timer);
        if(auth.isAuthenticated){
            try{
                await signin("","")
            }catch(e){
                console.error(e)
            }
        }
        setTimer(setTimeout( () => {
            ping();
        }, 10000))
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