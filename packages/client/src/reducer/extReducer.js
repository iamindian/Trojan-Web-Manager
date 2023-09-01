const initializtion = { user: {
  quota: "--",
  delta: "--",
  start: "--",
}, loading: false };
export default function reducer(state = initializtion, action) {
  switch (action.type) {
    case "update":
      return {
        user: action.payload[0]
      }
    case "loading":
      return { loading: true }
    case "loaded":
      return { loading: false }
    default:
      return state
  }
}