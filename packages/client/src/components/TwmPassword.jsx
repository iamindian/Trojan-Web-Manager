import TextField from '@mui/material/TextField';
const TwmPassword = (props) => {
    const passwordErrorMessage = "只允许输入数字";
    return <TextField helperText={passwordErrorMessage} {...props} id="standard-username" label="输入密码" variant="standard" /> 
}
export default TwmPassword;