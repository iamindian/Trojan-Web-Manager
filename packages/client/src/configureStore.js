import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import loggerMiddleware from "./middleware/logger";
import rootReducer from "./rootReducer";
export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [loggerMiddleware, ...getDefaultMiddleware()],
    preloadedState,
  })
  return store;
}
