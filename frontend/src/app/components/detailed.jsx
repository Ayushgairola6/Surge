'use client'

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { UpdateReaction, GetComments } from '../../store/postSlice'
import Link from 'next/link'
import Image from 'next/image'
import CommentPage from './CommentPage.jsx'
import LoadingCard from './loadingCard'
import Popup from '../Popup/page';
import { FaRegThumbsUp, FaRegThumbsDown, FaRegComments, FaHourglassStart, FaAngleDown } from "react-icons/fa";
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
import Summarizer from './Summarizer'
import { IoClose } from "react-icons/io5"
import { MdOutlineSmsFailed, MdSearch } from 'react-icons/md'
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
    const [showSumarray, setShowSummary] = useState(false);
    const [summary, setSummary] = useState(null);
    const [getting, setGetting] = useState("idle");
    const [Index, setIndex] = useState(0);
    const language = useRef();

    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const router = useRouter();
    useEffect(() => {
        const reaction = JSON.parse(localStorage.getItem("user_reaction"));
        if (!reaction) return;
        setCurrReaction(reaction);

    }, [])

    useEffect(() => {
        if (isLoggedIn == false) {
            router.push("/Popup")
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
        if (typeof window !== "undefined") {
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


    useEffect(() => {
        if (!socket.current) return;

        const handleLikeError = (data) => { /*...*/ };
        const handleUpdateReactionCounts = (data) => {
            setUpdatedDislikes(data.dislikeCount)
            setUpdatedLikes(data.likeCount)
        };

        socket.current.on("likeError", handleLikeError);
        socket.current.on("updateReactionCounts", handleUpdateReactionCounts);

        return () => {
            socket.current.off("likeError", handleLikeError);
            socket.current.off("updateReactionCounts", handleUpdateReactionCounts);
        };
    }, [socket.current]);


    async function getSummary() {
        setShowSummary(true);
        setGetting("pending")
        try {
            const token = localStorage.getItem("auth_token");
            const response = await axios.post(`http://localhost:8080/api/post/summary/${currPost[0].id}`, { lang: language.current.value }, {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            setGetting("idle")

            setSummary(response.data)
        } catch (error) {
            setGetting("failed")
            const time = setTimeout(() => {
                setGetting("idle")
            }, 2000)
            return () => clearTimeout(time);
        }
    }

    return (
        <>
            {currPost !== null ? (
                <>
                    {/* summary section */}
                    {showSumarray && (
                        <div className="fixed inset-0 bg-black bg-opacity-90 p-4 z-[9999] flex flex-col items-center justify-center">
                            <IoClose
                                size={20}
                                onClick={() => {
                                    setShowSummary(false);
                                    setSummary(null)
                                }}
                                className="absolute top-10 left-10 cursor-pointer animate-bounce"
                                color="white"
                            />
                            <section className='flex items-center justify-center gap-4 absolute top-3 right-10 flex-col'>
                                <label className='text-gray-400 text-xs' htmlFor="">The Language you prefer</label>
                                <div className='flex items-center justify-center gap-2'>
                                    <select className="rounded-xl px-2 py-1 transition-all text-xs md:text-sm duration-500 bg-black text-white border border-gray-400" ref={language} name="" id="">
                                        <option value="English">English</option>
                                        <option value="Hindi">Hindi</option>
                                        <option value="Japanese">Japanese</option>
                                        <option value="Korean">Korean</option>
                                        <option value="Chinese">Chinese</option>
                                        <option value="French">French</option>
                                        <option value="German">German</option>

                                    </select>
                                    {getting === "idle" && <button onClick={() => getSummary()} className='bg-white text-black px-2 py-1 rounded-xl transition-all text-xs md:text-sm flex items-center justify-center gap-2'>GetSummary <MdSearch className="animate-bounce" /></button>}
                                    {getting === "failed" && <div className='bg-red-200 text-red-500 border border-red-500 px-2 py-1 rounded-xl transition-all flex items-center text-xs md:text-sm justify-center gap-2'>failed <MdOutlineSmsFailed className='animate-bounce' /></div>}
                                    {getting === "pending" && <div className='bg-sky-200 text-sky-500 border border-sky-500 px-2 py-1 rounded-xl transition-all flex items-center justify-center text-xs md:text-sm
                                     gap-2'>Generating <FaHourglassStart className="animate-spin" /></div>}
                                </div>

                            </section>

                            <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 text-xs md:text-md lg:text-lg font-bold text-center">
                                {summary !== null ? summary : null}

                            </p>
                        </div>
                    )}
                    <div className="min-h-screen bg-black text-white relative">

                        <Summarizer showSumarray={showSumarray} setShowSummary={setShowSummary} summary={summary} setSummary={setSummary} post={currPost[0]} />
                        {/* the top most container that contains the user name and post data  */}
                        <div className=" h-full">
                            <section onClick={() => console.log(currPost)} className="w-[96%] mx-auto flex items-center justify-between gap-2 py-2 px-4   rounded-bl-xl rounded-br-xl ">
                                <div className="flex items-center justify-between  gap-2 flex-col ">
                                    <Image
                                        className="h-10 w-10 rounded-full"
                                        src={currPost[0].user_image}
                                        alt=""
                                        height={25}
                                        width={25}
                                    />
                                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-purple-600 to-white text-lg">@{currPost[0].username}</span>
                                </div>

                                <span className="flex items-center justify-between px-4 gap-4 ">
                                    <div className="relative">
                                        <CiMenuKebab
                                            onMouseEnter={() => setIndicate(true)}
                                            onMouseLeave={() => setIndicate(false)}
                                            className="cursor-pointer"
                                            onClick={() => setShowOptions(!showOption)}
                                            size={22}
                                        />

                                        {indicate && (
                                            <label
                                                className="text-white font-bold bg-black  text-sm py-1 px-3 rounded-full absolute -top-8 left-1/2 -translate-x-1/2 hidden md:block lg:block"
                                                htmlFor="menu"
                                            >
                                                Menu
                                            </label>
                                        )}

                                        {showOption && (
                                            <div
                                                onClick={() => setShowOptions(false)}
                                                className="absolute top-10 right-0 border border-purple-700 bg-black text-white rounded-xl w-[10rem] p-3 font-bold flex flex-col gap-4 z-50 cursor-pointer"
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

                            <section className="w-full px-3 relative flex flex-col items-center justify-center gap-4">
                                {/* Next Button */}
                                {currPost[0].media_urls.length > 0 ? <><ul
                                    className="absolute top-10 right-5 p-1 bg-black rounded-full z-[99] shadow-sm hover:shadow-purple-900 cursor-pointer hover:-rotate-90 transition-all duration-300"
                                    onClick={() => {
                                        if (currPost[0].media_urls.length > 0 && Index < currPost[0].media_urls.length - 1) {
                                            setIndex((prev) => prev + 1);
                                        }
                                    }}
                                >
                                    <FaAngleDown color="white" />
                                </ul>

                                    {/* Previous Button */}
                                    <ul
                                        className="absolute top-10 left-5 p-1 bg-black rounded-full z-[99] shadow-sm hover:shadow-purple-900 cursor-pointer hover:rotate-90 transition-all duration-300"
                                        onClick={() => {
                                            if (Index > 0) {
                                                setIndex((prev) => prev - 1);
                                            }
                                        }}
                                    >
                                        <FaAngleDown color="white" />
                                    </ul></> : null}

                                {/* Image wrapper (relative container for 'fill') */}
                                <div className="relative w-full max-w-[90vw] h-[25rem]">
                                    <Image
                                        className="rounded-xl object-contain"
                                        src={
                                            currPost[0].media_urls.length > 0
                                                ? currPost[0].media_urls[Index]
                                                : "/NoImage.jpg"
                                        }
                                        fill
                                        sizes="(max-width: 768px) 90vw, 1000px"
                                        alt="Post media"
                                        priority
                                    />
                                </div>

                                {/* Title */}

                                <h1 className="text-2xl md:text-3xl lg:text-4xl w-full font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 text-center">
                                    {currPost[0].title}
                                </h1>

                            </section>


                            {/* this container contains the post body with reaction buttons */}
                            <div className="p-2 w-full flex">
                                <p className="p-2 text-md font-serif w-full m-auto ">{currPost[0].body}</p>
                            </div>

                            <div className="flex items-center justify-center gap-5 p-4 relative cursor-pointer text-black">
                                <button
                                    onClick={() => setVibe(!vibe)}
                                    className="hover:scale-105 transition-all duration-500 cursor-pointer flex items-center justify-center gap-1 p-2 bg-white shadow-md shadow-indigo-600 rounded-full"
                                >
                                    {cussReaction !== null ? (
                                        <img
                                            className="h-8 hover:scale-125 transition-all duration-500"
                                            src={cussReaction}
                                            alt=""
                                        />
                                    ) : (
                                        <FaRegThumbsUp size={28} color="black" />
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
                                        <Image
                                            key={e.id}
                                            onClick={() => SaveReaction(e)}
                                            className="h-10 hover:scale-125 transition-all duration-500"
                                            src={e.link.src}
                                            alt={`reaction-${i}`}
                                            height={30}
                                            width={30}
                                        />
                                    ))}
                                </div>

                                <button onClick={() => {
                                    socket.current.emit("dislike_post", { post_id: id })
                                    setCurrReaction(null)
                                }}
                                    className="hover:scale-105 transition-all duration-500 cursor-pointer flex items-center justify-center gap-1 p-2 bg-white rounded-full shadow-md shadow-indigo-600"
                                >
                                    <FaRegThumbsDown
                                        size={28}
                                        color={dislikedPost.includes(id) ? "red" : "black"}
                                    />
                                    <span className="text-xl">{updatedDislikes !== null ? updatedDislikes : currPost[0].dislikeCount}</span>
                                </button>

                                <button
                                    onClick={toggleCommentSection}
                                    className="hover:scale-105 transition-all duration-500 cursor-pointer flex items-center justify-center gap-1 p-2 bg-white rounded-full shadow-md shadow-indigo-600"
                                >
                                    <FaRegComments size={28} />
                                    <span className="text-xl ">{currPost[0].comments}</span>
                                </button>
                            </div>

                            {ShowComment === true ? (
                                <CommentPage toggle={toggleCommentSection} ShowComment={ShowComment} id={id} />
                            ) : null}
                        </div>
                    </div>
                </>
            ) : (
                <div className="h-screen  flex flex-col items-center justify-center">
                    <h1 className="animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">Let Us Cook</h1>
                    <div className="h-8 w-8 rounded-full border-t-2 border-sky-700 animate-spin"></div>
                </div>
            )}


        </>
    )
}

export default DetailedPost
