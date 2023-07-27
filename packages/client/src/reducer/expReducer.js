const initializtion = { expiration: '--' };
export default function exReducer(state = initializtion, action) {
  switch (action.type) {
    case "update":
      return action.payload
    default:
      return state
  }
}