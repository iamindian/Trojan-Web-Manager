/* eslint-disable react/jsx-no-target-blank */
import 'react'
import './App.css'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
function App() {
  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItem: "center", flexWrap: "wrap"
    }}>
      <TextField id="standard-basic" label="输入用户名" variant="standard" />
      <div className='break'></div>
      <div style={{marginTop:"24px"}}>
        <Typography sx={{ fontSize: 10 }} color="text.secondary">
          有效期
        </Typography>
      </div>

    </div >
  )
}

export function Component() {
  return App();
}
