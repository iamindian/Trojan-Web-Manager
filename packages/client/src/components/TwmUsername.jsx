import TextField from '@mui/material/TextField';
const TwmUsername = (props) => {
    const userErrorMessage = "只允许输入允许小写a-z,大写A-Z,@,.";
    return <TextField helperText={userErrorMessage} {...props} id="standard-username" label="输入用户名" variant="standard" /> 
}
export default TwmUsername;