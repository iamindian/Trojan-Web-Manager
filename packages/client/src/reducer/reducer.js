const initializtion = { value: 0 };
export default function reducer(state = initializtion, action) {
  switch (action.type) {
    case "inc":
      return {
        value: state.value + 1
      }
    case "dec":
      return {
        value: state.value - 1
      }
    default:
      return state
  }
}