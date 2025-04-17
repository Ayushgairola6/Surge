// 'use client'
// import axios from "axios";
// import Image from "next/image";
// import { ArrowUpRight } from "lucide-react";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { UseStore } from "@/store/store";
// import {GetChats,GetRoomSpecificChats} from '@/store/ChatSlice';
// import {GetAccount,VerifyAccount} from '@/store/AuthSlice'
// import {useDispatch,useSelector} from 'react-redux';
// import LoadingCard from './loadingCard'
// const PostCard = () => {
//     // getting the user chats 



//       const [currHover,setCurrHover] = useState(null);  

//     // getting context of current tab being used by the user
//     const { currTab ,posts,setPosts} = UseStore();

//     useEffect(() => {
//         axios.get(`https://surge-oyqw.onrender.com/api/feed/posts/${currTab}`).then(res => {
//             console.log(res.data);
//             setPosts(res.data);
//         }).catch(error => {
//             alert(error);
//         })
//     }, [])


//     // functions to handle appearance and disappearance of the directive arrow in while hovering over the post

//     function whenOver(post){
//         if(post){
//         setCurrHover(post);            
//         }else{
//             return
//         }
//     }

//     function whenOut(post){
//         if(post){
//      setCurrHover(!post)       
//         }else{
//             return
//         }

//     }

//     function addFallbackImage(event){
//         event.target.src = "./NoImage.jpg"

//     }



//     return (<>
//         {/* post container */}<div className="container min-h-screen mx-auto p-2">
//         {posts !== null ? <div  className=" flex flex-wrap justify-center items-center gap-4 md:items-normal md:justify-normal">
//             {posts.map((post, index) => {
//                 return <>
//                     {/* postcard body */}
//                   <div   onMouseEnter={()=>whenOver(post)} onMouseLeave={()=>whenOut(post)} key={post.id} className="  rounded-xl  min-h-72 h-72 max-h-72
//                                       overflow-y-scroll relative  text-center p-1 font-serif border-2 border-black hover:shadow-md hover:shadow-black w-64 hide-scrollbar">
//                                                                                        {post===currHover?<Link className="absolute right-2 top-2 inline-flex items-center  bg-green-500 px-2 rounded-xl  justify-center border gap-2 border-black" href={`/DetailedPost/${post.id}`}>
//                                                                                        Read
//                                                                               <ArrowUpRight  className="bg-black font-extrabold text-white rounded-full " size={17} />

//                                                                           </Link>:null}

//                                           {/* post image */}

//                                           <img className="h-[70%] w-full" onError={addFallbackImage} src={post.image?post.image:"/NoImage.jpg"} alt="\" />
//                                            {/*Post title*/}
//                                           <span className="flex items-center justify-between gap-3   "> <h3 className="text-lg font-mono uppercase text-center font-bold">{post.title}</h3> </span>

//                                           {/* description */}

//                                           <p>
//                                               {post.body}
//                                           </p>
//                                            <div className="bg-black/30 absolute w-full "></div>
//                                       </div>


//                 </>
//             })}

//         </div> : <div className="h-screen w-full flex items-center justify-center ">

//             <h1 className="font-bold text-3xl font-mono animate-pulse">LOADING...</h1>
//         </div>
//         }
//         </div>

//     </>)
// }

// export default PostCard;
'use client'
import axios from "axios";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UseStore } from "@/store/store";
// import LoadingCard from "./loadingcard";

const PostCard = () => {
  // Although we retain currHover for now, its only purpose is to trigger effects if needed
  const [currHover, setCurrHover] = useState(null);
  // Getting current tab and posts from the global store
  const { currTab, posts, setPosts } = UseStore();

  useEffect(() => {
    axios
      .get(`https://surge-oyqw.onrender.com/api/feed/posts/${currTab}`)
      .then((res) => {
        console.log(res.data);
        setPosts(res.data);
      })
      .catch((error) => {
        alert(error);
      });
  }, [currTab, setPosts]);

  // Functions to set and clear current hover state
  function whenOver(post) {
    setCurrHover(post);
  }

  function whenOut() {
    setCurrHover(null);
  }

  // Fallback function to update the image source if the provided image fails to load
  function addFallbackImage(event) {
    event.target.src = "./NoImage.jpg";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      {posts === null ? (
        // Loading state when posts is null
        <div className="flex items-center justify-center h-screen">
          <h1 className="font-bold text-3xl font-mono animate-pulse text-gray-700">
            LOADING...
          </h1>
        </div>
      ) : posts.length > 0 ? (
        // Display posts if there are any
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              onMouseEnter={() => whenOver(post)}
              onMouseLeave={() => whenOut()}
              className="relative bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              {/* Post Image */}
              <div className="h-48 w-full relative">
                <img
                  onError={addFallbackImage}
                  src={post.image ? post.image : "/NoImage.jpg"}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black opacity-20"></div>
              </div>
              {/* Post Content */}
              <div className="p-4">
                <h3 className="text-xl font-mono uppercase font-bold text-gray-800 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {post.body}
                </p>
              </div>
              {/* Read Button at Bottom */}
              <div className="px-4 pb-4">
                <Link className="" href={`/DetailedPost/${post.id}`}>
                  <p className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 border border-gray-400  text-white px-4 py-2 rounded-full shadow hover:bg-green-600 transition-colors shadow-sm shadow-black">
                    Read <ArrowUpRight size={20} className="ml-2" />
                  </p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Fallback for no posts available
        <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 text-center">
          <svg
            className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-6a3 3 0 016 0v6M5 12a9 9 0 0118 0"
            />
          </svg>
          <h1 className="font-bold text-2xl sm:text-3xl font-mono text-gray-700">
            No posts available!
          </h1>
          <p className="text-gray-500 mt-2 text-base sm:text-lg">
            Try selecting another category.
          </p>
        </div>

      )}
    </div>

  );
};

export default PostCard;
