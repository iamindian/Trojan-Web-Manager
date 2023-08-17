import { useState } from "react";
function useCheckUsername() {
    const userRegex = /^[a-zA-Z@_.]+$/;
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    function checkUsername(e) {
        if (userRegex.test(e.target.value)) {
            setUsernameError(false);
            setUsername(e.target.value)
        } else {
            setUsernameError(true)
        }
    }
    return [
        username, usernameError, checkUsername,
    ]
}
export default useCheckUsername;