import { useEffect, useState } from "react"
import { signin } from "../api/userService"
import auth from "../auth"
import { redirect } from "react-router-dom"
function KeepAlive(props) {
    let [timer, setTimer] = useState()
    async function ping() {
        clearTimeout(timer);
        if (sessionStorage.getItem("isAuthenticated") === "true") {
            try {
                await signin("", "")
            } catch (e) {
                if (e.response.status === 401) {
                    sessionStorage.setItem("isAuthenticated", 'false')
                    window.dispatchEvent(new Event('storage'))
                    return redirect("/login")
                }
            }
        }
        setTimer(setTimeout(() => {
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