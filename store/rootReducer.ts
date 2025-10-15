import { combineReducers } from "@reduxjs/toolkit"
import { adminApi } from "../services/adminApi"

// Example empty slice reducer (replace/add as needed)
const exampleReducer = (state = {}, action: any) => state

export const rootReducer = combineReducers({
  example: exampleReducer,
  [adminApi.reducerPath]: adminApi.reducer,
  // Add more reducers here as your team implements them
})

export type RootState = ReturnType<typeof rootReducer>
