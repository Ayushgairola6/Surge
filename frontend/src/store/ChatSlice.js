import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const GetChats = createAsyncThunk(
    'chats/all',
    async (thunkAPI) => {
        const token = localStorage.getItem("auth_token");
        try {
            const response = await axios.get("http://localhost:8080/api/chats/all/data/", {
                withCredentials: true,
                headers: {
                    "Content-Type": "mulipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            throw error;
        }

    }
)

export const GetRoomSpecificChats = createAsyncThunk(
    'specific/chats',

    async (room_name, thunkAPI) => {
        const token = localStorage.getItem("auth_token");
        try {
            const response = await axios.get(`http://localhost:8080/api/chats/chats/${room_name}`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "mulipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            throw error;
        }

    }
)

const ChatSlice = createSlice({
    name: 'Chats',
    initialState: {
        chats: null,
        status: 'idle',
        error: null,
        chatData: null,
    }, reducers: {

    }, extraReducers: (builder) => {
        builder.addCase(GetChats.rejected, (state, action) => {
            state.error = action.payload;
            state.status = 'failed'
            console.log(action.payload, action);
        }).addCase(GetChats.pending, (state, action) => {
            state.status = "pending"
        }).addCase(GetChats.fulfilled, (state, action) => {
            state.status = "idle"
            state.chats = action.payload
        })
            // specific chat chatData
            .addCase(GetRoomSpecificChats.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed'
            })
            .addCase(GetRoomSpecificChats.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(GetRoomSpecificChats.fulfilled, (state, action) => {
                state.chatData = action.payload;
                state.status = "idle"
            })
    }
})

export default ChatSlice.reducer;
