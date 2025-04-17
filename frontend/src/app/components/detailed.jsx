// 'use client'

// import { BiSolidUpvote, BiUpvote, BiDownvote, BiSolidDownvote } from 'react-icons/bi'
// import { CiMenuKebab } from 'react-icons/ci';
// import { FaComment } from 'react-icons/fa';
// import { FaMessage } from 'react-icons/fa6';
// import { SlUserFollow } from 'react-icons/sl';
// import { MdExpandMore } from 'react-icons/md';
// import Image from "next/image";
// import { useEffect, useState } from 'react';
// import axios from "axios";
// import { useSelector, useDispatch } from 'react-redux'
// import { UpdateReaction } from "../../store/postSlice"
// import { GetComments } from "../../store/postSlice"
// import Link from 'next/link'
// import CommentPage from "./CommentPage.jsx";
// import LoadingCard from './loadingCard.jsx';
// const DetailedPost = ({ id }) => {

//     const dispatch = useDispatch();
//     const post = useSelector(state => state.posts.post);
//     const [likedPost, setLikedPost] = useState([]);
//     const [dislikedPost, setDislikedPost] = useState([]);
//     const [currPost, setCurrPost] = useState(null);
//     const [ShowComment, setShowComment] = useState(false);
//     const [showOption, setShowOptions] = useState(false);
//     // accessing the id of the post from the /:id params
//     const user = useSelector(state => state.auth.user)
//     const token = localStorage.getItem("auth_token");

//     useEffect(() => {

//         // Retrieve likedPosts and dislikedPosts from localStorage
//         if (localStorage) {
//             const data_liked = JSON.parse(localStorage.getItem("likedPosts")) || [];
//             setLikedPost(data_liked);

//             const data_disliked = JSON.parse(localStorage.getItem("dislikedPosts")) || [];
//             setDislikedPost(data_disliked);
//         }

//         //fetch the clicked post 
//         const fetchPost = async () => {
//             try {
//                 const res = await axios.get(`https://surge-oyqw.onrender.com/api/feed/post/${id}`, {
//                     withCredentials: true,
//                     headers: {
//                         "Authorization": `Bearer ${token}`
//                     }
//                 });
//                 console.log(res.data)
//                 setCurrPost(res.data);
//             }
//             catch (error) { throw new Error(error) }
//         };
//         // call the function
//         fetchPost();

//     }, [id])





//     // Like Post function
//     function LikePost() {
//         const isLiked = likedPost.includes(id);
//         const isDisliked = dislikedPost.includes(id);

//         if (isLiked) {
//             // alert("Post already liked");
//             return;
//         }

//         if (isDisliked) {
//             // Remove from dislikedPosts if the post is disliked
//             const updatedDislikedPost = dislikedPost.filter((i) => id !== i);
//             setDislikedPost(updatedDislikedPost);
//             localStorage.setItem("dislikedPosts", JSON.stringify(updatedDislikedPost));
//         }

//         // Add to likedPosts
//         const updatedLikedPost = [...likedPost, id];
//         setLikedPost(updatedLikedPost);
//         localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPost));

//         // Dispatch the action
//         dispatch(UpdateReaction(id));
//     }

//     // Dislike Post function
//     function dislikePost() {
//         const isLiked = likedPost.includes(id);
//         const isDisliked = dislikedPost.includes(id);

//         if (isDisliked) {
//             // alert("Post already disliked");
//             return;
//         }

//         if (isLiked) {
//             // Remove from likedPosts if the post is liked
//             const updatedLikedPost = likedPost.filter((i) => id !== i);
//             setLikedPost(updatedLikedPost);
//             localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPost));
//         }

//         // Add to dislikedPosts
//         const updatedDislikedPost = [...dislikedPost, id];
//         setDislikedPost(updatedDislikedPost);
//         localStorage.setItem("dislikedPosts", JSON.stringify(updatedDislikedPost));

//         // Dispatch the action
//         dispatch(UpdateReaction(id));
//     }

//     // function to toggle CommentPage;
//     function toggleCommentSection() {
//         setShowComment(!ShowComment)
//         dispatch(GetComments(id))
//     }

//     return <>
//         {currPost !== null ? <>
//             <div className="min-h-screen w-full relative mt-4">

//                 <div className="relative border border-gray-300   rounded-lg  p-1 font-sans  w-full h-full">
//                     {/*Post title*/}
//                     <span className="flex items-center justify-between px-4  gap-4  ">
//                         {user ? <img className="h-12 w-12" src={user.User.image} /> : <img className="h-12 w-12" src="/NoImage.jpg" />}
//                         <h3 className=" text-xl uppercase font-serif font-bold ">{currPost[0].title}</h3>

//                         {/*  menu options toggle icon*/}
//                         <CiMenuKebab className="relative" onClick={() => setShowOptions(!showOption)} size={22} />
//                         {showOption === true ?
//                             <div className="absolute right-10 top-0 bg-black text-white rounded-xl w-[10rem] p-3 font-bold  flex items-normal justify-center flex-col gap-4 ">
//                                 <Link className="flex items-center justify-evenly hover:scale-125 px-3" href={`/User2Account/${currPost[0].author}`}>Connect <FaMessage size={12} color="white" /></Link>
//                                 <Link className="flex items-center justify-evenly hover:scale-125 px-3" href="/Account">Follow <SlUserFollow size={17} color="white" /></Link>
//                                 <Link className="flex items-center justify-evenly hover:scale-125 px-3" href={`/Chats/${currPost[0].author}`}>More <MdExpandMore size={20} color="white" /></Link >
//                             </div> : null}

//                     </span>

//                     <img className="w-full h-72  mt-4" src={currPost[0].image ? currPost[0].image : "/NoImage.jpg"} alt="img" />
//                     {/* description */}
//                     <p className="font-sans font-semibold text-center text-lg">
//                         {currPost[0].body}
//                     </p>
//                     {/* tags */}
//                     {    /* <span className="font-bold font-mono font-xl text-left">tags</span>*/}
//                 </div>


//                 {/* buttons to like or dislike */}
//                 <div className="flex items-center justify-evenly w-40 shadow-md shadow-black  absolute right-2  px-3 py-2 rounded-xl">
//                     {/*  upvote*/}
//                     <button onClick={LikePost}>
//                         {!likedPost.includes(id) ? <BiUpvote className="hover:scale-125" size={22} />
//                             : <BiSolidUpvote className="hover:scale-125" color="red" size={22} />}
//                     </button>
//                     {/*  downvote*/}
//                     <button onClick={dislikePost}>
//                         {!dislikedPost.includes(id) ? <BiDownvote className="hover:scale-125 " size={22} />
//                             : <BiSolidDownvote className="hover:scale-125" color="red" size={22} />}
//                     </button>
//                     {/*comment icon*/}
//                     <button onClick={toggleCommentSection}>
//                         <FaComment className="hover:scale-125" />
//                     </button>
//                 </div>
//                 {ShowComment === true ? <CommentPage toggle={toggleCommentSection} ShowComment={ShowComment} id={id} token={token} /> : null}
//             </div>
//         </> : <div className="h-full w-full flex flex-col items-center justify-center"><h1>loading....</h1>
//             <LoadingCard />
//         </div>}
//     </>
// }

// export default DetailedPost;
'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { UpdateReaction, GetComments } from '../../store/postSlice'
import Link from 'next/link'
import CommentPage from './CommentPage.jsx'
import LoadingCard from './loadingCard'
import Popup from '../Popup/page';
import { FaRegThumbsUp, FaRegThumbsDown, FaRegComments } from "react-icons/fa";
import Evil from '../../assets/devil-svgrepo-com.svg'
import smile from '../../assets/in-love-svgrepo-com.svg'
import cry from '../../assets/cry-svgrepo-com.svg'
import shutup from '../../assets/shut-up-svgrepo-com.svg'
import injured from '../../assets/injuried-svgrepo-com.svg'
import { CiMenuKebab } from 'react-icons/ci';
import { FaMessage } from "react-icons/fa6";
import { MdExpandMore } from "react-icons/md";
import { SlUserFollow } from 'react-icons/sl';
import { useRouter } from 'next/navigation';

const DetailedPost = ({ id }) => {
    const dispatch = useDispatch()
    const post = useSelector((state) => state.posts.post)
    const [likedPost, setLikedPost] = useState([])
    const [dislikedPost, setDislikedPost] = useState([])
    const [currPost, setCurrPost] = useState(null)
    const [ShowComment, setShowComment] = useState(false)
    const [showOption, setShowOptions] = useState(false)
    const user = useSelector((state) => state.auth.user)
    const [vibe, setVibe] = useState(false)
    const [cussReaction, setCurrReaction] = useState(null);
    const [indicate, setIndicate] = useState(false);
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const router = useRouter();
    let token;
    useEffect(() => {
        if (!localStorage) return;
        const reaction = JSON.parse(localStorage.getItem("user_reaction"));
        token = localStorage.getItem("auth_token")
        if (!reaction) return;
        setCurrReaction(reaction);

    }, [])

    useEffect(() => {
        if (isLoggedIn == false) {
            router.push("/")
        }
    }, [isLoggedIn])

    const reactions = [{
        id: 0,
        name: "naughty",
        link: Evil
    },
    {
        id: 1,
        name: "Wow",
        link: smile
    }, {
        id: 2,
        name: "Injured",
        link: injured
    }, {
        id: 3,
        name: "cry",
        link: cry
    }, {
        id: 4,
        name: "No Words",
        link: shutup
    }]


    function SaveReaction(e) {
        if (e) {
            setVibe(false)
            setCurrReaction(e.link.src)
            localStorage.setItem("user_reaction", JSON.stringify(cussReaction));
            LikePost()
        }
    }
    useEffect(() => {
        // Retrieve likedPosts and dislikedPosts from localStorage
        if (localStorage) {
            const data_liked = JSON.parse(localStorage.getItem('likedPosts')) || []
            setLikedPost(data_liked)
            const data_disliked = JSON.parse(localStorage.getItem('dislikedPosts')) || []
            setDislikedPost(data_disliked)
        }

        // Fetch the clicked post
        const fetchPost = async () => {
            const token = localStorage.getItem('auth_token')

            try {
                const res = await axios.get(`https://surge-oyqw.onrender.com/api/feed/post/${id}`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setCurrPost(res.data)
            } catch (error) {
                throw new Error(error)
            }
        }
        fetchPost()
    }, [id])

    // Like Post function
    function LikePost() {
        if (!id) return;
        const isLiked = likedPost.includes(id)
        const isDisliked = dislikedPost.includes(id)

        if (isLiked) return

        if (isDisliked) {
            // Remove from dislikedPosts if the post is disliked
            const updatedDislikedPost = dislikedPost.filter((i) => id !== i)
            setDislikedPost(updatedDislikedPost)
            localStorage.setItem("user_reaction", JSON.stringify(cussReaction));

            localStorage.setItem('dislikedPosts', JSON.stringify(updatedDislikedPost))
        }

        // Add to likedPosts
        const updatedLikedPost = [...likedPost, id]
        setLikedPost(updatedLikedPost)
        localStorage.setItem("user_reaction", JSON.stringify(cussReaction));
        localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPost))

        // Dispatch the action
        dispatch(UpdateReaction(id))
    }

    // Dislike Post function
    function dislikePost() {
        if (!id) return;
        const isLiked = likedPost.includes(id)
        const isDisliked = dislikedPost.includes(id)

        if (isDisliked) return

        if (isLiked) {
            // Remove from likedPosts if the post is liked
            const updatedLikedPost = likedPost.filter((i) => id !== i)
            setLikedPost(updatedLikedPost)
            setCurrReaction(null);
            localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPost))
        }

        // Add to dislikedPosts
        const updatedDislikedPost = [...dislikedPost, id]
        setDislikedPost(updatedDislikedPost)
        localStorage.setItem('dislikedPosts', JSON.stringify(updatedDislikedPost))

        // Dispatch the action
        dispatch(UpdateReaction(id))
    }

    // Function to toggle CommentPage;
    function toggleCommentSection() {
        setShowComment(!ShowComment)
        dispatch(GetComments(id))
    }

    return (
        <>
            {currPost !== null ? (
                <>
                    <div  className="min-h-screen">
                        {/* the top most container that contains the user name and post data  */}
                        <div className=" h-full">
                            <section className="w-[96%] mx-auto flex items-center justify-between gap-2 py-2 px-4   rounded-bl-xl rounded-br-xl my-2">
                                <div className="flex items-center justify-center  gap-2">
                                    <img
                                        className="h-20 w-20 rounded-full"
                                        src={currPost[0].user_image}
                                        alt=""
                                    />
                                    <span className="font-bold text-green-800 text-lg">@{currPost[0].username}</span>
                                </div>

                                <span className="flex items-center justify-between px-4 gap-4 ">
                                    <div className="relative">
                                        <CiMenuKebab
                                            onMouseEnter={() => setIndicate(true)}
                                            onMouseLeave={() => setIndicate(false)}
                                            className="cursor-pointer"
                                            onClick={() => setShowOptions(!showOption)}
                                            size={30}
                                        />

                                        {indicate && (
                                            <label
                                                className="text-white font-bold bg-black text-sm py-1 px-3 rounded-full absolute -top-8 left-1/2 -translate-x-1/2"
                                                htmlFor="menu"
                                            >
                                                Menu
                                            </label>
                                        )}

                                        {showOption && (
                                            <div
                                                onClick={() => setShowOptions(false)}
                                                className="absolute top-10 right-0 bg-black text-white rounded-xl w-[10rem] p-3 font-bold flex flex-col gap-4 z-50 cursor-pointer"
                                            >
                                                <Link
                                                    href={`/User2Account/${currPost[0].author}`}
                                                    className="flex items-center justify-between px-3 transition-all duration-300 hover:bg-white hover:text-black rounded-full"
                                                    aria-label="Connect"
                                                >
                                                    Connect <FaMessage size={12} />
                                                </Link>

                                                <Link
                                                    href="/Account"
                                                    className="flex items-center justify-between px-3 transition-all duration-300 hover:bg-white hover:text-black rounded-full"
                                                    aria-label="Follow"
                                                >
                                                    Follow <SlUserFollow size={17} />
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </span>
                            </section>

                            <section className="w-full px-3 relative">
                                <img
                                    className="w-full m-auto max-h-[25rem] rounded-xl"
                                    src={currPost[0].image ? currPost[0].image : "/"}
                                    alt=""
                                />
                                <h1 className="absolute text-xl md:text-2xl lg:text-3xl w-full font-bold text-gray-300 text-center bottom-5 left-1">
                                    He Started Clapping When the Plane Landed
                                </h1>
                            </section>

                            {/* this container contains the post body with reaction buttons */}
                            <div className="p-2 w-full flex">
                                <p className="p-2 text-xl w-full m-auto font-semibold">{currPost[0].body}</p>
                            </div>

                            <div className="flex items-center justify-center gap-5 p-4 relative cursor-pointer">
                                <button
                                    onClick={() => setVibe(!vibe)}
                                    className="hover:scale-105 transition-all duration-500 cursor-pointer flex items-center justify-center gap-1 p-2 bg-gray-400 rounded-full"
                                >
                                    {cussReaction !== null ? (
                                        <img
                                            className="h-8 hover:scale-125 transition-all duration-500"
                                            src={cussReaction}
                                            alt=""
                                        />
                                    ) : (
                                        <FaRegThumbsUp size={28} />
                                    )}
                                    <span className="text-xl">0</span>
                                </button>

                                {/* Icons appear above the main buttons */}
                                <div
                                    className={`absolute flex items-center justify-center gap-2 bottom-16 ${vibe ? "flex" : "hidden"
                                        } transition-all duration-500 border-t border-gray-400`}
                                >
                                    {reactions.map((e, i) => (
                                        <img
                                            key={e.id}
                                            onClick={() => SaveReaction(e)}
                                            className="h-10 hover:scale-125 transition-all duration-500"
                                            src={e.link.src}
                                            alt={`reaction-${i}`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={dislikePost}
                                    className="hover:scale-125 transition-all duration-500 cursor-pointer flex items-center justify-center gap-1 p-2 bg-gray-400 rounded-full"
                                >
                                    <FaRegThumbsDown
                                        size={28}
                                        color={dislikedPost.includes(id) ? "red" : "black"}
                                    />
                                    <span className="text-xl">0</span>
                                </button>

                                <button
                                    onClick={toggleCommentSection}
                                    className="hover:scale-125 transition-all duration-500 cursor-pointer flex items-center justify-center gap-1 p-2 bg-gray-400 rounded-full"
                                >
                                    <FaRegComments size={28} />
                                    <span className="text-xl">0</span>
                                </button>
                            </div>

                            {ShowComment === true ? (
                                <CommentPage toggle={toggleCommentSection} ShowComment={ShowComment} id={id} token={token} />
                            ) : null}
                        </div>
                    </div>
                </>
            ) : (
                <div className="h-screen  flex flex-col items-center justify-center">
                    <h1 className="animate-pulse">Let Us Cook...</h1>
                    <LoadingCard />
                </div>
            )}


        </>
    )
}

export default DetailedPost
