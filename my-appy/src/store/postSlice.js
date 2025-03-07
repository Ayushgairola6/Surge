import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// likeDislike Post
export const UpdateReaction = createAsyncThunk(
    'reaction/update',
   async (Post_id, thunkAPI) => { 
    const token = localStorage.getItem("userdata");
     try { 
        const response = await axios.patch(`https://surge-oyqw.onrender.com/api/feed/Reaction/${Post_id}`, {}, 
            { 
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}` 
                }});
        return response.data;
        } catch (error) {
            alert(error);
            throw error;
        }
    }
)

export const Add_Comment = createAsyncThunk(
    'comment/Add',
    async ({Post_id,Comment}, thunkAPI) => {
   const token = localStorage.getItem("userdata");

        try {
            const response = await axios.post(`https://surge-oyqw.onrender.com/api/feed/post/comment/${Post_id}`,Comment,{
                headers: {
                    "Content-Type": "text/plain",
                 "authorization" :`Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            alert(error);
            throw error;
        }
    }
)

export const GetComments = createAsyncThunk(
    'comments/fetch',
    async (Post_id, thunkAPI) => {
   const token = localStorage.getItem("userdata");
   
        try {
            const response = await axios.get(`https://surge-oyqw.onrender.com/api/feed/post/Allcomments/${Post_id}`,{
                headers: {
                 "authorization" :`Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            alert(error);
            throw error;
        }
    }
)

const postSlice = createSlice({
     name: 'post',
    initialState: {
        post:null,
        error:null,
        status:"idle",
        comments:null,
        commentStatus:"idle",
        MyComment:null

},reducers:{

},
 extraReducers: (builder) => {
        builder.addCase(UpdateReaction.pending, (state, action) => {
            state.status = "loading..."
        })
        .addCase(UpdateReaction.rejected,(state,action)=>{
            state.error = action.payload;
        })
        .addCase(UpdateReaction.fulfilled,(state,action)=>{
            state.status = "complete";

        })
        // add comment
        .addCase(Add_Comment.rejected,(state,action)=>{
            state.error = action.payload;
        })
        .addCase(Add_Comment.fulfilled,(state,action)=>{
           state.MyComment  =action.payload
            state.commentStatus = "done"
        })
        .addCase(Add_Comment.pending,(state,action)=>{
        })
        // fetch commentStatus
         .addCase(GetComments.pending, (state, action) => {
            state.status = "loading..."
        })
        .addCase(GetComments.rejected,(state,action)=>{
            state.error = action.payload;
        })
        .addCase(GetComments.fulfilled,(state,action)=>{
            state.comments = action.payload;
        })
 }})





export default postSlice.reducer;