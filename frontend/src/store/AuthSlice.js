import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const SignupUser = createAsyncThunk(
    'auth/signup',
    async (form, thunkAPI) => {
        try {
            const response = await axios.post("https://surge-oyqw.onrender.com/api/user/register", form, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            })

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)

        }
    }
)
export const GetAccount = createAsyncThunk(
    'Account/data',
    async (form, thunkAPI) => {
        const token = localStorage.getItem("auth_token");

        try {
            const response = await axios.get("https://surge-oyqw.onrender.com/api/user/account/data", {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            // console.log(response.data)
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)

        }
    }
)

export const LoginUser = createAsyncThunk(
    'auth/login',
    async (form, thunkAPI) => {
        try {
            const response = await axios.post("https://surge-oyqw.onrender.com/api/user/login", form, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.data.message === "Login successful") {
                localStorage.setItem("auth_token", response.data.token);
                await thunkAPI.dispatch(GetAccount());
                // Combine and return data
            }
            return response.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)

        }
    }
)



export const UploadProfilePic = createAsyncThunk(
    'Upload/img',
    async (form, thunkAPI) => {
        const token = localStorage.getItem("auth_token");
        try {
            const response = await axios.put("https://surge-oyqw.onrender.com/api/user/upload", form, {
                withCredentials: true,
                headers: {
                    "Content-Type": "mulipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            })
            if (response.data.message === "Updated successfully") {
                await thunkAPI.dispatch(GetAccount());
            }
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)

        }
    }
)
export const VerifyAccount = createAsyncThunk(
    'verify/account',
    async (form, thunkAPI) => {
        const token = localStorage.getItem("auth_token");
        try {

            const response = await axios.get("https://surge-oyqw.onrender.com/api/user/account/verify", {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (response.data.message === "Authorized") {
                await thunkAPI.dispatch(GetAccount());
                // Combine and return data
                return response.data;

            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)

        }
    }
)

export const ResetPassword = createAsyncThunk(
    'reset/password',
    async (data, thunkAPI) => {
        const token = localStorage.getItem("auth_token");
        try {
            const response = await axios.put("https://surge-oyqw.onrender.com/api/user/password/reset", data, {
                withCredentials: true, headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (response.data.message === "Updated") {
                return response.data;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
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
        Signupstatus: false,
        status: "idle",
        isUploading: "idle",
        passwordUpdated: "idle"
    }, reducers: {
      updateState:(state,action)=>{
         state.passwordUpdated  = "idle";
      }
    },
    extraReducers: (builder) => {
        builder.addCase(SignupUser.pending, (state, action) => {
            state.status = "loading"
        })
            .addCase(SignupUser.rejected, (state, action) => {
                state.Signupstatus = false;

                state.error = action.payload;
            })
            .addCase(SignupUser.fulfilled, (state, action) => {
                state.Signupstatus = true;
                state.status = "idle"
            })
            // login status
            .addCase(LoginUser.rejected, (state, action) => {
                state.loginstatus = "failed"
                state.error = action.payload;
            })
            .addCase(LoginUser.pending, (state, action) => {
                state.loginstatus = "loading"
                state.user = action.payload;
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.loginstatus = "success"
                state.loginstatus = "idle"


            })
            // GetAccountdata
            .addCase(GetAccount.fulfilled, (state, action) => {
                state.user = action.payload
            })
            // verify account
            .addCase(VerifyAccount.pending, (state, action) => {
                state.isLoggedIn = false;
            })
            .addCase(VerifyAccount.rejected, (state, action) => {
                state.isLoggedIn = false;
            })
            .addCase(VerifyAccount.fulfilled, (state, action) => {
                if (action.payload && action.payload.message === "Authorized") {
                    state.isLoggedIn = true;

                }
            })
            //image upload
            .addCase(UploadProfilePic.rejected, (state, action) => {
                state.isUploading = "failed";
                setInterval(() => {
                    state.isUploading = "idle"
                }, 3000);
            })
            .addCase(UploadProfilePic.pending, (state, action) => {
                state.isUploading = "pending"
            })
            .addCase(UploadProfilePic.fulfilled, (state, action) => {
                state.isUploading = "idle"
            })
            //reset password
            .addCase(ResetPassword.pending, (state, action) => {
                state.passwordUpdated = "pending"
            })
            .addCase(ResetPassword.rejected, (state, action) => {
                state.passwordUpdated = "failed"
             
            })
            .
            addCase(ResetPassword.fulfilled, (state, action) => {
                state.passwordUpdated = 'success'
            })

    }
})
export const {updateState} = authSlice.actions;
export default authSlice.reducer;