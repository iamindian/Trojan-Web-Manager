/* eslint-disable react/jsx-no-target-blank */
import { useState, useEffect, Suspense } from 'react'

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux'
import { extendById, addUser } from "../api/userService";
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
import useCheckPassword from '../hooks/useCheckPassword';
import useCheckUsername from '../hooks/useCheckUsername';
import TwmUsername from '../components/TwmUsername';
// import ReactJson from 'react-json-view'
import { useLoaderData, useParams, Await, useOutletContext } from 'react-router-dom';
import TwmPassword from '../components/TwmPassword';

function Admin() {
  let user = useLoaderData();
  const { id } = useParams();
  const [username, usernameError, checkUsername] = useCheckUsername();
  const [quantity, setQuantity] = useState(0);
  const [password, passwordError, checkPassword] = useCheckPassword();
  const extReducer = useSelector((state) => state.extReducer)
  const dispatch = useDispatch();
  const { openAlert } = useOutletContext();
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
      user.userPromise.then(async (resp) => {
        const response = await extendById(resp.data.users[0].id, quantity);
        dispatch(loaded());
        dispatch(update(response.data))
        openAlert(`${response.data.username} expiration has been extended ${quantity} months successfully`);
      })

    } catch (e) {
      throw e;
      dispatch(loaded());
    }


  }
  const add = async () => {
    try {
      const response = await addUser(username, password);
      dispatch(loaded());
      openAlert(`${response.data.username} has been added successfully`);
    } catch (e) {
      openAlert(e);
      dispatch(loaded());
    }
  }

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItem: "center", padding: "16px"
    }}>
      <Suspense fallback={<div>User information fetching</div>}>
        <Await resolve={user.userPromise} errorElement={
          <div>Fail to fetch user information</div>
        }>
          {(data) => {
            return (
              <Stack spacing={2} direction="column">
                <TwmUsername disabled={!!id} defaultValue={data.data.users[0].username} error={usernameError} onBlur={checkUsername} />
                {id ? "" : <TwmPassword error={passwordError} onBlur={checkPassword} />}
                {id ? <TextField
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }} variant="standard" type="number" defaultValue={0} label="Month quantity" inputProps={{ min: 0, max: 255, inputMode: 'numeric', pattern: '[0-9]*' }} /> : ""}

                <LoadingButton style={{ marginTop: "24px" }} size="small" onClick={() => {
                  if (!usernameError && !passwordError) {
                    dispatch(loading());
                    id ? extendExpiration() : add();
                  }

                }} variant="contained" loading={extReducer.loading} endIcon={<SendIcon />}>{id?"Renew":"Add"}</LoadingButton>
                {/* <ReactJson style={{ marginTop: "24px" }} src={extReducer.user} /> */}
              </Stack>)
          }}

        </Await>
      </Suspense>
    </div >
  )
}
export function Component() {
  return Admin();
}
Component.displayName = "Admin";
