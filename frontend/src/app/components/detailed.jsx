'use client'

import { useEffect, useRef, useState } from 'react'
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
import { io } from 'socket.io-client';
import { UseStore } from '@/store/store';

const DetailedPost = ({ id }) => {

    const dispatch = useDispatch()
    const { socket } = UseStore();
    const controller = new AbortController();
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
    const [updatedLikes, setUpdatedLikes] = useState(null);
    const [updatedDislikes, setUpdatedDislikes] = useState(null);
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const router = useRouter();
    let token;
    useEffect(() => {
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
            setVibe(false);
    
            if (cussReaction === null) {
                // No prior reaction — like the post
                setCurrReaction(e.link.src);
                socket.current.emit("like_Post", { post_id: id });
    
            } else if (cussReaction === e.link.src) {
                // Same reaction clicked again — remove like
                setCurrReaction(null);
                socket.current.emit("like_Post", { post_id: id });
    
            } else {
                // Different reaction selected — just update reaction visually
                setCurrReaction(e.link.src);
            }
    
            localStorage.setItem("user_reaction", JSON.stringify(cussReaction));
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
                const res = await axios.get(`http://localhost:8080/api/feed/post/${id}`, {
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
        return () => {
            controller.abort();
        };
    }, [id])




    // Function to toggle CommentPage;
    function toggleCommentSection() {
        setShowComment(!ShowComment)
        dispatch(GetComments(id))
    }

    // listenimg to reaction events
    useEffect(() => {
        if (!socket.current) return;

        socket.current.on("likeError", (data) => {
            // console.log("error while liking the post", data)
        })
        socket.current.on("updateReactionCounts", (data) => {
            console.log(data)
            setUpdatedDislikes(data.dislikeCount)
            setUpdatedLikes(data.likeCount)
        })

    }, [socket.current])


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

                                                {/* <Link
                                                    href="/Account"
                                                    className="flex items-center justify-between px-3 transition-all duration-300 hover:bg-white hover:text-black rounded-full"
                                                    aria-label="Follow"
                                                >
                                                    Follow <SlUserFollow size={17} />
                                                </Link> */}
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
                                    {currPost[0].title}
                                </h1>
                            </section>

                            {/* this container contains the post body with reaction buttons */}
                            <div className="p-2 w-full flex">
                                <p className="p-2 text-md font-serif w-full m-auto ">{currPost[0].body}</p>
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
                                    <span className="text-xl">{updatedLikes !== null ? updatedLikes : currPost[0].likeCount}</span>
                                </button>

                                {/* Icons appear above the main buttons */}
                                <div onClick={() => {
                                    if (cussReaction === null) return;
                                    // socket.current.emit("like_Post", { post_id: id })

                                }}
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

                                <button onClick={() => {
                                    socket.current.emit("dislike_post", { post_id: id })
                                    setCurrReaction(null)
                                }}
                                    className="hover:scale-125 transition-all duration-500 cursor-pointer flex items-center justify-center gap-1 p-2 bg-gray-400 rounded-full"
                                >
                                    <FaRegThumbsDown
                                        size={28}
                                        color={dislikedPost.includes(id) ? "red" : "black"}
                                    />
                                    <span className="text-xl">{updatedDislikes !== null ? updatedDislikes : currPost[0].dislikeCount}</span>
                                </button>

                                <button
                                    onClick={toggleCommentSection}
                                    className="hover:scale-125 transition-all duration-500 cursor-pointer flex items-center justify-center gap-1 p-2 bg-gray-400 rounded-full"
                                >
                                    <FaRegComments size={28} />
                                    <span className="text-xl">{currPost[0].comments}</span>
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
