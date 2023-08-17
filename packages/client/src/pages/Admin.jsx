/* eslint-disable react/jsx-no-target-blank */
import { useState } from 'react'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux'
import { extend } from "../api/userService";
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
import useCheckPassword from '../hooks/useCheckPassword';
import useCheckUsername from '../hooks/useCheckUsername';
import TwmUsername from '../components/TwmUsername';
import TwmPassword from '../components/TwmPassword';
import ReactJson from 'react-json-view'
function Admin() {
  const [username, usernameError, checkUsername] = useCheckUsername();
  const [quantity, setQuantity] = useState(0);
  const [password, passwordError, checkPassword] = useCheckPassword();
  const extReducer = useSelector((state) => state.extReducer)
  const dispatch = useDispatch();
  const update = value => {
    return {
      type: "update",
      payload: value
    }
  }
  const loaded = () => ({
    type: "loaded"
  })
  const loading = () => ({
    type: "loading"
  })
  const extendExpiration = async () => {
    try {
      const response = await extend(username, password, quantity);
      dispatch(loaded());
      dispatch(update(response.data))
    } catch (e) {
      dispatch(loaded());
    }


  }

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItem: "center", padding:"16px"
    }}>
      <Stack spacing={2} direction="column" style={{width:"100% "}}>
        <TwmUsername error={usernameError} onBlur={checkUsername} />
        <TwmPassword error={passwordError} onBlur={checkPassword} />
        <TextField
          onChange={(e) => {
            setQuantity(e.target.value);
          }} variant="standard" type="number" inputProps={{ min: 0, max: 255, inputMode: 'numeric', pattern: '[0-9]*' }} />

        <LoadingButton style={{ marginTop: "24px" }} size="small" onClick={() => {
          if (!usernameError && !passwordError) {
            dispatch(loading());
            extendExpiration();

          }

        }} variant="contained" loading={extReducer.loading} endIcon={<SendIcon />}>续费</LoadingButton>

        <ReactJson style={{ marginTop: "24px" }} src={extReducer.user} />
      </Stack>


    </div >
  )
}
export function Component() {
  return Admin();
}
Component.displayName = "Admin";
