import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice'
import postReducer from "./postSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts:postReducer,
    }
})