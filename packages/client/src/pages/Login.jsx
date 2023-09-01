import TwmUsername from "../components/TwmUsername"
import TwmPassword from "../components/TwmPassword"
import useCheckUsername from "../hooks/useCheckUsername"
import useCheckPassword from "../hooks/useCheckPassword"
import { useNavigate } from "react-router-dom";
import { Stack, Button } from "@mui/material"
import { signin } from "../api/userService";
import Typography from '@mui/material/Typography';
import auth from "../auth"
function Login(props) {
    const navigate = useNavigate();
    const [username, usernameError, checkUsername] = useCheckUsername()
    const [password, passwordError, checkPassword] = useCheckPassword()
    const login = async () => {
        if (!usernameError && !passwordError) {
            const response = await signin(username, password)
            if (response.status === 200) {
                sessionStorage.setItem("isAuthenticated",'true');
                window.dispatchEvent( new Event('storage') ) 
                navigate("/users")
            }
        }

    }
    return (<div style={{
        display: "flex", justifyContent: "center", alignItem: "center", flexWrap: "wrap"
    }}>
        <Stack spacing={2} direction="column">
            <Typography sx={{ fontSize: 20 ,textAlign:"center"}} color="text.secondary">
                Login
            </Typography>
            <TwmUsername error={usernameError} onBlur={checkUsername} />
            <TwmPassword error={passwordError} onBlur={checkPassword} />
            <Button variant="contained" onClick={login}>登录</Button>
        </Stack>
    </div>)
}
export function Component() {
    return Login();
}
Component.displayName = "Login";
