import { configureStore } from "@reduxjs/toolkit"
import { rootReducer } from "./rootReducer"
import { adminApi } from "../api/adminApi"

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
