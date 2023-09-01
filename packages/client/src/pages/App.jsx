/* eslint-disable react/jsx-no-target-blank */
import { useState } from 'react'
import './App.css'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux'
import { getExpiration } from "../api/userService";
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError ,setPasswordError] = useState(false);
  const userRegex = /^[a-zA-Z@_.]+$/;
  const passwordRegex = /^[0-9]+$/;
  const userErrorMessage = "只允许输入允许小写a-z,大写A-Z,@,.";
  const passwordErrorMessage = "只允许输入数字";
  const exReducer = useSelector((state) => state.exReducer)
  const dispatch = useDispatch();
  const update = value => ({
    type: "update",
    payload: value[0]
  })
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
  const checkUsername = (e)=>{
    if(userRegex.test(e.target.value)){
      setUsernameError(false);
      setUsername(e.target.value)
    }else{
      setUsernameError(true)
    }
  }
  const checkPassword = (e)=>{
    if(passwordRegex.test(e.target.value)){
      setPasswordError(false);
      setPassword(e.target.value)
    }else{
      setPasswordError(true);
    }
  }
  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItem: "center", flexWrap: "wrap"
    }}>
      <Stack spacing={2} direction="row">
        <TextField helperText={userErrorMessage} error={usernameError} id="standard-username" label="输入用户名" variant="standard" onBlur={checkUsername} />
        <TextField helperText={passwordErrorMessage} error={passwordError} id="standard-password" label="输入密码" variant="standard" onBlur={checkPassword} />
        
      </Stack>
      <div className='break'></div>
      <div>
      <LoadingButton style={{marginTop: "24px"}} size="small" onClick={() => {
          if(!username || !password){
            return;
          }
          dispatch(loading());
          setTimeout(() => { fetchExpiration(); }, 1000)
        }} variant="contained" loading={exReducer.loading} endIcon={<SendIcon />}>查询</LoadingButton>
      </div>
      
      <div className='break'></div>
      <div style={{ marginTop: "24px" }}>
        <Typography sx={{ fontSize: 18 }} color="text.secondary">
          有效期: {exReducer.expiration} 天
        </Typography>
      </div>
      {/* <div className='break'></div>
      <button onClick={() => {
        dispatch({ type: "inc" })
      }}>+</button>
      <div className='break'></div>
      <div style={{ marginTop: "24px" }}>
        <Typography sx={{ fontSize: 10 }} color="text.secondary">
          测试: {reducer.value}
        </Typography>
      </div>
      <div className='break'></div>
      <button onClick={() => {
        dispatch({ type: "inc" })
      }}>+</button>
      <button onClick={() => {
        dispatch({ type: "dec" })
      }}>-</button> */}

    </div >
  )
}
export function Component() {
  return App();
}
