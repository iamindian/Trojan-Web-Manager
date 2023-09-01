import { combineReducers } from 'redux';

import extReducer from "./reducer/extReducer";
import expReducer from "./reducer/expReducer";
const rootReducer = combineReducers({
  extReducer,
  expReducer
})

export default rootReducer