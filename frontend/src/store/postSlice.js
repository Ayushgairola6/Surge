import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// likeDislike Post
export const UpdateReaction = createAsyncThunk(
    'reaction/update',
    async (Post_id, thunkAPI) => {
        const token = localStorage.getItem("auth_token");
        try {
            const response = await axios.put(`http://localhost:8080/api/feed/Reaction/${Post_id}`,{},
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
)

export const Add_Comment = createAsyncThunk(
    'comment/Add',
    async ({ post_id, comment }, thunkAPI) => {
        const token = localStorage.getItem("auth_token");
        console.log(comment);
        try {
            const response = await axios.post(`http://localhost:8080/api/feed/post/comment/${post_id}`, { comment: comment }, {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (response.data.message === "Comment added") {
                await thunkAPI.dispatch(GetComments(post_id));
            }
            return response.data;
        } catch (error) {

            throw error;
        }
    }
)

export const GetComments = createAsyncThunk(
    'comments/fetch',
    async (Post_id, thunkAPI) => {
        const token = localStorage.getItem("auth_token");

        try {
            const response = await axios.get(`http://localhost:8080/api/feed/post/Allcomments/${Post_id}`, {
                withCredentials: true,
                headers: {
                    "authorization": `Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            throw error;
        }
    }
)

const postSlice = createSlice({
    name: 'post',
    initialState: {
        post: null,
        error: null,
        status: "idle",
        comments: null,
        commentStatus: "idle",
        MyComment: null

    }, reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(UpdateReaction.pending, (state, action) => {
            state.status = "loading..."
        })
            .addCase(UpdateReaction.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(UpdateReaction.fulfilled, (state, action) => {
                state.status = "complete";

            })
            // add comment
            .addCase(Add_Comment.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(Add_Comment.fulfilled, (state, action) => {
                state.MyComment = action.payload
                state.commentStatus = "done"
            })
            .addCase(Add_Comment.pending, (state, action) => {
            })
            // fetch commentStatus
            .addCase(GetComments.pending, (state, action) => {
                state.status = "loading..."
            })
            .addCase(GetComments.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(GetComments.fulfilled, (state, action) => {
                state.comments = action.payload;
            })
    }
})





export default postSlice.reducer;