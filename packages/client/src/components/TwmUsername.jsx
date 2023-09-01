import TextField from '@mui/material/TextField';
const TwmUsername = (props) => {
    const userErrorMessage = "a-z,A-Z,@,.";
    return (<TextField helperText={userErrorMessage} {...props} id="standard-username" label="Username" variant="standard" /> )
}
export default TwmUsername;