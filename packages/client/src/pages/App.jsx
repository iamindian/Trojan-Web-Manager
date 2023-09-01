/* eslint-disable react/jsx-no-target-blank */
import { useState } from 'react'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux'
import { getExpiration } from "../api/userService";
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
import TwmPassword from '../components/TwmPassword';
import TwmUsername from '../components/TwmUsername';
import useCheckUsername from '../hooks/useCheckUsername';
import useCheckPassword from '../hooks/useCheckPassword';
function App() {
  const [username, usernameError, checkUsername] = useCheckUsername();
  const [password, passwordError, checkPassword] = useCheckPassword();
  const expReducer = useSelector((state) => state.expReducer)
  const dispatch = useDispatch();
  const update = value => {
    if (value && value.length > 0) {
      return {
        type: "update",
        payload: value[0]
      }
    } else {
      return {
        type: "update",
        payload: { expiration: '--' }
      }
    }

  }
  const loaded = () => ({
    type: "loaded"
  })
  const loading = () => ({
    type: "loading"
  })
  const fetchExpiration = async () => {
    const response = await getExpiration(username, password)
    dispatch(loaded());
    dispatch(update(response.data))
  }


  return (

    <div style={{
      display: "flex", justifyContent: "center", alignItem: "center", flexWrap: "wrap", padding: "16px"
    }}>
      <Stack spacing={2} direction="column">
        <TwmUsername error={usernameError} onBlur={checkUsername} />
        <TwmPassword error={passwordError} onBlur={checkPassword} />
        <LoadingButton style={{ marginTop: "24px" }} size="small" onClick={() => {
          if (usernameError || passwordError) {
            return;
          }
          dispatch(loading());
          fetchExpiration();
        }} variant="contained" loading={expReducer.loading} endIcon={<SendIcon />}>Query</LoadingButton>
        <Typography sx={{ fontSize: 18 }} color="text.secondary">
          Expiration: {expReducer.expiration} days
        </Typography>
      </Stack>
    </div >
  )
}
export function Component() {
  return App();
}
Component.displayName = "App";
