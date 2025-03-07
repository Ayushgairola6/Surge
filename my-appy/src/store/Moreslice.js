import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const Getdata = createAsyncThunk(
    'More/data',
    async (id,token, thunkAPI) => {
        
        try {
        

            const response = await axios.get(`https://surge-oyqw.onrender.com/api/user/profile/${id}`, {
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
       status:"idle",
    }, reducers: {

    },
     extraReducers: (builder) => {
        builder.addCase(Getdata.pending, (state, action) => {
            state.status = "loading..."
        })
            .addCase(Getdata.rejected, (state, action) => {
                state.status = "Network error"
                state.error = action.payload;
            })
            .addCase(Getdata.fulfilled, (state, action) => {
                state.status = "idle"
                state.Account = action.payload;
            })

  }
})


export default MoreSlice.reducer;
            