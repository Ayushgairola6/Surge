import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice'
import postReducer from "./postSlice"
import moreReducer from "./Moreslice"
import chatReducer from './ChatSlice'
// redux store provider
export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts:postReducer,
        more:moreReducer,
        chat:chatReducer,
    }
})