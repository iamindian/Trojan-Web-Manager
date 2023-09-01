import { useState } from "react";
function useCheckPassword() {
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const passwordRegex = /^[0-9]+$/;
    const checkPassword = (e) => {
        if (passwordRegex.test(e.target.value)) {
            setPasswordError(false);
            setPassword(e.target.value)
        } else {
            setPasswordError(true);
        }
    }
    return [
        password, passwordError, checkPassword
    ]

}
export default useCheckPassword