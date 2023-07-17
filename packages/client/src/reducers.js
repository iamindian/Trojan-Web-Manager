import { combineReducers } from 'redux';

import couterSlice from './redouce/counterSlice';

const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `todosReducer`
  counter: couterSlice,
})

export default rootReducer