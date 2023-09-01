import TextField from '@mui/material/TextField';
const TwmPassword = (props) => {
    const passwordErrorMessage = "Number allowed only";
    return <TextField helperText={passwordErrorMessage} {...props} id="standard-username" label="password" variant="standard" /> 
}
export default TwmPassword;