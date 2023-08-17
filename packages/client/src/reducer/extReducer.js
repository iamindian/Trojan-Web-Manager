const initializtion = {
  user: {
    username: "--",
    password: "--",
    delta: "--",
    start: "--",
  }, loading: false
};
export default function extReducer(state = initializtion, action) {
  switch (action.type) {
    case "update":
      return { user: action.payload }
    case "loading":
      return { loading: true }
    case "loaded":
      return { loading: false }
    default:
      return state
  }
}