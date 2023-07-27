/* eslint-disable react/jsx-no-target-blank */
import {useState} from 'react'
import './App.css'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux'
import { getExpiration } from "../api/userService";
function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const exReducer = useSelector((state) => state.exReducer)
  const dispatch = useDispatch();
  const update = value => ({
    type: "update",
    payload: value[0]
  })
  const fetchExpiration = async ()=>{
     const response = await getExpiration(username, password)
     dispatch(update(response.data))
  }
  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItem: "center", flexWrap: "wrap"
    }}>
      <TextField id="standard-username" label="输入用户名" variant="standard" onChange={(e)=>{
        setUsername(e.target.value)
      }}/>
      <div className='break'></div>
      <TextField style={{ marginTop: "24px" }} id="standard-password" label="输入密码" variant="standard" onChange={(e)=>{
        setPassword(e.target.value)
      }}/> 
      <div className='break'></div>
      <button style={{ marginTop: "24px" }} onClick={() => {
        fetchExpiration();
      }}>query</button>
      <div className='break'></div>
      <div style={{ marginTop: "24px" }}>
        <Typography sx={{ fontSize: 18 }} color="text.secondary">
          测试: {exReducer.expiration}
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
