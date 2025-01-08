import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const SignupUser = createAsyncThunk(
    'auth/signup',
    async (form, thunkAPI) => {
        try {
            const response = await axios.post("http://localhost:8080/api/user/register", form, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            return response.data;
        } catch (error) {
            alert(error);
            throw error;
        }
    }
)

export const LoginUser = createAsyncThunk(
    'auth/login',
    async (form, thunkAPI) => {
        try {
            const response = await axios.post("http://localhost:8080/api/user/login", form, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            localStorage.setItem("userdata", response.data.token);
            return response.data;
        } catch (error) {
            alert(error);
            throw error;
        }
    }
)


export const GetAccount = createAsyncThunk(
    'Account/data',
    async (form, thunkAPI) => {
        const token = localStorage.getItem("userdata");
        try {
            const response = await axios.get("http://localhost:8080/api/user/account/data", {
                headers: {
                    "Authorization" : `Bearer ${token}`
                }
            })
            console.log(response.data)
            return response.data;
        } catch (error) {
            alert(error);
            throw error;
        }
    }
)

export const UploadProfilePic = createAsyncThunk(
    'Upload/img',
    async (form, thunkAPI) => {
        const token = localStorage.getItem("userdata");
        try {
            const response = await axios.patch("http://localhost:8080/api/user/upload",form ,{
                headers: {
                    "Content-Type":"mulipart/form-data" ,
                    "Authorization" : `Bearer ${token}`
                }
            })
            console.log(response.data)
            return response.data;
        } catch (error) {
            alert(error);
            throw error;
        }
    }
)




const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isLoggedIn: false,
        error: null,
        loginstatus: "idle",
        Signupstatus: "idle"
    }, reducers: {

    },
     extraReducers: (builder) => {
        builder.addCase(SignupUser.pending, (state, action) => {
            state.Signupstatus = "loading..."
            console.log(action.meta)
        })
            .addCase(SignupUser.rejected, (state, action) => {
                state.Signupstatus = "Network error"
                state.error = action.payload;
            })
            .addCase(SignupUser.fulfilled, (state, action) => {
                state.Signupstatus = "idle"
                console.log(action.payload)
            })
            // login status
            .addCase(LoginUser.rejected, (state, action) => {
                state.loginstatus = "Network error"
                state.error = action.payload;
            })
            .addCase(LoginUser.pending, (state, action) => {
                state.loginstatus = "loading"
                state.user = action.payload;
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.isLoggedIn=!state.isLoggedIn;
                console.log(state.isLoggedIn);
                state.loginstatus = "idle"

            })
            // GetAccountdata
            .addCase(GetAccount.fulfilled,(state,action)=>{
                state.user = action.payload
            })
            // upload profileImage
            .addCase(UploadProfilePic.fulfilled,(state,action)=>{
            })
    }
})

export default authSlice.reducer;