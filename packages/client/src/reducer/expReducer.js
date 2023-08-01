const initializtion = { expiration: '--', loading: false };
export default function exReducer(state = initializtion, action) {
  switch (action.type) {
    case "update":
      return action.payload
    case "loading":
      return {loading: true}
    case "loaded":
      return {loading: false}
    default:
      return state
  }
}