import TextField from '@mui/material/TextField';
const TwmUsername = (props) => {
    const userErrorMessage = "a-z,大写A-Z,@,.";
    return (<TextField helperText={userErrorMessage} {...props} id="standard-username" label="username" variant="standard" /> )
}
export default TwmUsername;