const initializtion = { expiration: "--", loading: false };
export default function exReducer(state = initializtion, action) {
  switch (action.type) {
    case "update":
      return {expiration: action.payload.expiration}
    case "loading":
      return {loading: true}
    case "loaded":
      return {loading: false}
    default:
      return state
  }
}