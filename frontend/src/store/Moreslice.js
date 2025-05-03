import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const Getdata = createAsyncThunk(
    'More/data',
    async (id, thunkAPI) => {
        const token = localStorage.getItem("auth_token")
        try {

            //
            const response = await axios.get(`http://localhost:8080/api/user/profile/${id}`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


const MoreSlice = createSlice({
    name: 'more',
    initialState: {
        Account: null,
        status: "idle",
    }, reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(Getdata.pending, (state, action) => {
            state.status = "loading..."
            console.log("pending");
        })
            .addCase(Getdata.rejected, (state, action) => {
                state.status = "Network error"
                state.error = action.payload;
                console.log("rejected");
            })
            .addCase(Getdata.fulfilled, (state, action) => {
                state.status = "idle"
                state.Account = action.payload;
            })

    }
})


export default MoreSlice.reducer;
