import { combineReducers } from 'redux';

import reducer from "./reducer/reducer";
import exReducer from "./reducer/expReducer";
const rootReducer = combineReducers({
  reducer,
  exReducer
})

export default rootReducer