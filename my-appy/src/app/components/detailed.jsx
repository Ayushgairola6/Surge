'use client'

import {BiSolidUpvote,BiUpvote,BiDownvote,BiSolidDownvote} from 'react-icons/bi'
import {FaComment} from 'react-icons/fa';
import Image from "next/image";
import {useEffect,useState} from 'react';
import axios from "axios";
import {useSelector , useDispatch } from 'react-redux'
import {UpdateReaction} from "../../store/postSlice"
import {GetComments} from "../../store/postSlice"

import CommentPage from "./CommentPage";
import LoadingCard from './loadingCard';
const DetailedPost =  ({id}) => {

    const dispatch = useDispatch();
    const post = useSelector(state=>state.posts.post);
    const [likedPost ,setLikedPost]= useState([]);
    const [dislikedPost,setDislikedPost] = useState([]);
    const [currPost,setCurrPost] = useState(null);
    const [ShowComment,setShowComment] = useState(false);
   // accessing the id of the post from the /:id params
   const user = useSelector(state=>state.auth.user)
    const token = localStorage.getItem("userdata");

             useEffect(()=>{
                 if(!token){
                alert("You are not verified");
                return ;
             }
           // Retrieve likedPosts and dislikedPosts from localStorage
                if(localStorage){
                    const data_liked = JSON.parse(localStorage.getItem("likedPosts")) || [];
                setLikedPost(data_liked);

                    const data_disliked = JSON.parse(localStorage.getItem("dislikedPosts")) || [];
                    setDislikedPost(data_disliked);
                }
                
             //fetch the clicked post 
               const fetchPost = async () => 
             
             {try { const res = await axios.get(`http://localhost:8080/api/feed/post/${id}`,{
                headers:{
                    "Authorization":`Bearer ${token}`
                }
             }); 
                 console.log(res.data); 
                 setCurrPost(res.data); } 
                 catch (error) 
                  { alert(error); } }; 
                   // call the function
                   fetchPost();

             },[id])
             
        
          


            // Like Post function
function LikePost() {
    const isLiked = likedPost.includes(id);
    const isDisliked = dislikedPost.includes(id);

    if (isLiked) {
        alert("Post already liked");
        return;
    }

    if (isDisliked) {
        // Remove from dislikedPosts if the post is disliked
        const updatedDislikedPost = dislikedPost.filter((i) => id !== i);
        setDislikedPost(updatedDislikedPost);
        localStorage.setItem("dislikedPosts", JSON.stringify(updatedDislikedPost));
    }

    // Add to likedPosts
    const updatedLikedPost = [...likedPost, id];
    setLikedPost(updatedLikedPost);
    localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPost));

    // Dispatch the action
    dispatch(UpdateReaction(id));
}

// Dislike Post function
function dislikePost() {
    const isLiked = likedPost.includes(id);
    const isDisliked = dislikedPost.includes(id);

    if (isDisliked) {
        alert("Post already disliked");
        return;
    }

    if (isLiked) {
        // Remove from likedPosts if the post is liked
        const updatedLikedPost = likedPost.filter((i) => id !== i);
        setLikedPost(updatedLikedPost);
        localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPost));
    }

    // Add to dislikedPosts
    const updatedDislikedPost = [...dislikedPost, id];
    setDislikedPost(updatedDislikedPost);
    localStorage.setItem("dislikedPosts", JSON.stringify(updatedDislikedPost));

    // Dispatch the action
    dispatch(UpdateReaction(id));
}
              // function to toggle CommentPage;
                function toggleCommentSection(){
                    setShowComment(!ShowComment)
                   dispatch(GetComments(id))
                }

    return <>
        {currPost!==null?<>
            <div className="min-h-screen w-full relative mt-4">

            <div  className="relative border border-gray-300  h-fit rounded-lg  p-1 font-sans  w-full h-full">
                    {/*Post title*/}
                    <span className="flex items-center justify-start  gap-4 pl-3 ">
                        {user?<img className="h-12 w-12" src={user.User.image} />:<img className="h-12 w-12" src="/NoImage.jpg" />}
                        <h3 className=" text-xl uppercase font-serif font-bold ">{currPost[0].title}</h3>
                        
                    </span>
                    
                    <img className="w-full h-72  mt-4" src={currPost[0].image?currPost[0].image:"/NoImage.jpg"} alt="img" />
                    {/* description */}
                    <p className="font-sans font-semibold text-center text-lg">
                        {currPost[0].body}
                    </p>
                    {/* tags */}
               {    /* <span className="font-bold font-mono font-xl text-left">tags</span>*/}
                </div>
                {/* buttons to like or dislike */}
               <div className="flex items-center justify-evenly w-40 shadow-md shadow-black  absolute right-2  px-3 py-2 rounded-xl">
           {/*  upvote*/}
                <button  onClick={LikePost}>
                   {!likedPost.includes(id)?<BiUpvote className="hover:scale-125"  size={22}/>
                                      :<BiSolidUpvote className="hover:scale-125" color="red" size={22}/>}
                </button>
           {/*  downvote*/}
                <button onClick={dislikePost}>
                  { !dislikedPost.includes(id)?<BiDownvote className="hover:scale-125 "  size={22}/>
                                     :<BiSolidDownvote className="hover:scale-125" color="red" size={22} />}
                </button>
            {/*comment icon*/}
              <button onClick={toggleCommentSection}>
                  <FaComment className="hover:scale-125" />
              </button>
                 </div>
                 {ShowComment===true?<CommentPage toggle={toggleCommentSection} ShowComment={ShowComment} id={id} token={token}/>:null}
               </div>
               </>: <div className="h-full w-full flex flex-col items-center justify-center"><h1>loading....</h1>
                <LoadingCard/>
               </div>}
    </>
}

export default DetailedPost;