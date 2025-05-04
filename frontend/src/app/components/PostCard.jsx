'use client'
import axios from "axios";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { UseStore } from "@/store/store";
import { motion } from 'framer-motion';
import { MdCancel } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa";
// import LoadingCard from "./loadingcard";

const PostCard = () => {
  // Although we retain currHover for now, its only purpose is to trigger effects if needed
  const [currHover, setCurrHover] = useState(null);
  const [clickedImg, setClickedImg] = useState(null);
  const [showImg, setShowImg] = useState(false);
  const [ImgIndex, setImgIndex] = useState(0);
  // Getting current tab and posts from the global store
  const { currTab, posts, setPosts } = UseStore();

  useEffect(() => {
    axios
      .get(`https://surge-oyqw.onrender.com/api/feed/posts/${currTab}`)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((error) => {
        // alert(error);
      });
  }, [currTab, setPosts]);



  function IncrementImages(post) {
    if (currHover === post && ImgIndex < post.media_urls.length - 1) {
      setImgIndex((prev) => prev + 1);
    }
  }

  function DecrementImage(post) {
    if (currHover === post && ImgIndex !== 0) {
      setImgIndex((prev) => prev - 1);
    }
  }





  return (
    <div className="min-h-screen bg-black py-8 px-4 relative">
      {showImg && (
        <div className="bg-black absolute inset-0 z-[9999] flex items-center justify-center">
          <MdCancel
            onClick={() => setShowImg(false)}
            className="absolute top-5 left-5 cursor-pointer"
            size={28}
            color="white"
          />

          <div className="relative w-[90vw] h-[80vh] max-w-[1000px]"> {/* This is key for next/image fill */}
            <Image
              src={clickedImg}
              alt="preview"
              fill
              className="object-contain rounded"
              sizes="(max-width: 768px) 90vw, 1000px"
              priority
            />
          </div>
        </div>
      )}

      {
        posts === null ? (
          <div className="flex items-center justify-center h-screen gap-3 ">
            <h1 className="font-bold text-2xl text-center font-mono animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
              Let us cook
            </h1>
            <div className="h-5 w-5 rounded-full animate-spin border-t-2 border-sky-500 "></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
            {posts.map((post) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                key={post.id}
                onMouseEnter={() => {
                  setCurrHover(post)
                  if (ImgIndex > 0) {
                    setImgIndex(0);
                  }
                }}
                onMouseLeave={() => {
                  //remove the hover post
                  setCurrHover((prev) => prev !== post)
                  //and reset the counter to be 0
                  if (ImgIndex > 0) {
                    setImgIndex(0);
                  }
                }}
                className="relative bg-gradient-to-br from-white/15 to-white/5 
              rounded-xl  overflow-hidden hover:shadow-sm transition-transform duration-300 
              "
              >
                <div className="h-48 w-full relative flex items-center justify-center gap-2">
                  <Image
                    onClick={() => {
                      setShowImg(true)
                      setClickedImg(post.media_urls.length > 0 ? post.media_urls[ImgIndex] : "/NoImage.jpg");
                    }}
                    layout="fill" // required

                    src={post?.media_urls.length > 0 ? post.media_urls[ImgIndex] : "/NoImage.jpg"}
                    alt={post.title}
                    className="object-cover w-full h-full relative z-[99]"
                  />
                  {post.media_urls.length > 0 ? <> <ul className="absolute top-10 hover:rotate-90 transition-all duration-300 left-5 p-1 bg-black rounded-full z-[99] shadow-sm hover:shadow-purple-900 cursor-pointer">
                    <FaAngleDown onClick={() => DecrementImage(post)} className="" color="white" />
                  </ul>
                    <ul className="absolute hover:-rotate-90 transition-all duration-300 shadow-sm hover:shadow-purple-900 top-10 right-5 p-1 bg-black rounded-full z-[99] cursor-pointer">
                      <FaAngleDown onClick={() => IncrementImages(post)} className="" color="white" />
                    </ul></> : null}


                  <div className="absolute inset-0 bg-black opacity-20"></div>
                </div>
                {/* Post Content */}
                <div className="p-4">
                  <div className="flex items-center justify-start gap-3  w-full">
                    <Link className="h-12 w-12 rounded-full" href={`/User2Account/${post.author}`}>
                      <Image className="h-10 w-10 rounded-full" height={20} width={20} src={post.user_image ? post.user_image : "/"} alt="" />
                    </Link>
                    <span className="font-serif text-md text-white">@{post.username}</span>
                  </div>
                  <h3 className="text-lg font-mono uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-white text-sm line-clamp-3">
                    {post.body}
                  </p>
                </div>
                <div className="px-4 pb-4 w-full">
                  <Link className="w-full" href={`/DetailedPost/${post.id}`}>
                    <p className="inline-flex items-center bg-gradient-to-br from-indigo-600 to-purple-700   text-white px-4 py-1 rounded-full  hover:from-indigo-600 hover:to-sky-600  shadow-sm shadow-black w-full transition-all duration-700">
                      Read <ArrowUpRight size={15} className="ml-2" />
                    </p>
                  </Link>
                </div>
              </motion.div>
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

        )
      }
    </div >

  );
};

export default PostCard;
