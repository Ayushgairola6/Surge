'use client'
import axios from "axios";
import { useRef, useState, useEffect } from 'react';
import CicularLoader from "../components/CircularLoader"
import { useSelector } from 'react-redux'
import { redirect } from "next/navigation"
import PostcreationIndicator from "../components/CreatingPostIndicator";
import { LuImagePlus } from "react-icons/lu";
import { IoMdVideocam } from "react-icons/io";
import { MdCancel } from "react-icons/md";
const Create_Post = () => {

  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  const [PostStatus, setPostStatus] = useState("idle")
  const [token, setToken] = useState(null);
  const [selectedImg, setSelectedImg] = useState([]);
  const [ActualImgs, setActualImgs] = useState([]);
  const [words, setWords] = useState(0);
  const categoryRef = useRef();
  const titleRef = useRef();
  const ImageRef = useRef();
  const captionRef = useRef();
  const tagRef = useRef();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("auth_token"));
    }
  }, []);

  if (isLoggedIn === false) {
    redirect("/Popup");
  }

  // A function that creates a post
  async function handlePostCreate() {
    const form = new FormData();
    if (categoryRef.current.value === "" || captionRef.current.value === "" || titleRef.current.value === "" || tagRef.current.value === "") return;
    const wordCount = CalculateTypedWords()
    if (wordCount < 50) {
      return;
    }
    form.append('category', categoryRef.current.value);
    form.append('title', titleRef.current.value);
    form.append('caption', captionRef.current.value);
    form.append('hashtags', tagRef.current.value);

    if (ActualImgs.length > 0) {
      ActualImgs.forEach((file) => {
        form.append("images", file); // matches multer's `upload.array("image")`
      });
    }
    ClearForm();

    try {
      setPostStatus("pending");
      const res = await axios.post("http://localhost:8080/api/feed/create", form, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.data.message === "Post has been created") {
        setPostStatus("done");
      } else {
        setPostStatus("error");
      }
      const reset = setTimeout(() => {
        setPostStatus("idle");
      }, 3000)

      return res.data;
    } catch (error) {
      setPostStatus("idle");
      throw new Error(error);
    }
  }

  function ClearForm() {
    categoryRef.current.value = "";
    titleRef.current.value = "";
    captionRef.current.value = "";
    tagRef.current.value = "";
  }

  function handleMediaRemove(img) {
    const newSet = selectedImg.filter((e) => e !== img);
    setSelectedImg(newSet);
  }


  function CalculateTypedWords() {
    if (captionRef.current) {
      const wordCount = captionRef.current.value.trim().split(/\s+/).filter(Boolean).length;
      setWords(wordCount);
      return wordCount;
    }
  }


  return (
    <div className=" mx-auto p-6 bg-black text-white space-y-4 font-bold">
      <PostcreationIndicator status={PostStatus} setIsVisible={setPostStatus} />
      {/* Form title */}
      <h2 className="text-2xl mb-6
        text-center text-transparent bg-clip-text 
       bg-gradient-to-r from-indigo-600 to-purple-600 font-bold">Create a Post</h2>

      {/* Category */}
      <div className="flex flex-col space-y-2  p-2 rounded-xl">
        <label htmlFor="dropdown" className="text-lg font-semibold text-gray-300">Choose Your Vibe!</label>
        <select ref={categoryRef} className="bg-black border border-gray-400 text-white rounded-xl p-3 focus:outline-none focus:ring-2
         focus:ring-blue-500 transition duration-300">
          <option className="font-semibold  " value="Crush Confessions">Crush Confessions</option>
          <option className="font-semibold  " value="Green and Red flags">Green and Red flags</option>
          <option className="font-semibold  " value="First Date stories">First Date stories</option>
          <option className="font-semibold  " value="Gossip zone">Gossip zone</option>
          <option className="font-semibold  " value="Match Me Up">Match Me Up</option>
          <option className="font-semibold  " value="Breakup Corner">Breakup Corner</option>
          <option className="font-semibold" value="Mental Check-In">Mental Check-In</option>
        </select>
      </div>

      {/* Title */}
      <div className="flex flex-col space-y-2  p-2 rounded-xl" >
        <label htmlFor="title" className="text-lg font-semibold text-gray-300">Title</label>
        <input
          ref={titleRef}
          type="text"
          name="title"
          className=" rounded-xl p-3 border border-purple-700  text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>

      {/* Image Upload */}
      <div className=" flex-col space-y-2  p-2 rounded-xl flex items-normal justify-start gap-2">
        <label htmlFor="image" className="text-lg font-semibold text-gray-300">Choose any media upto 20Mb</label>
        <input
          ref={ImageRef}
          onChange={(e) => {
            if (selectedImg.length > 3) {
              alert("Yep that is the limit currently!")
              return;
            }
            const files = Array.from(e.target.files);
            const file = e.target.files[0];
            if (file && selectedImg.length<=3 && ActualImgs.length<=3) {
              setSelectedImg((prev) => [...prev, { url: URL.createObjectURL(file), type: file.type }]);
              setActualImgs((prev) => [...prev, ...files])
            }else{
              alert("Currently we support 3 Images at a time!")
            }

          }}
          type="file"
          name="image"
          className="p-3 hidden rounded-xl  border border-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
        <div className="flex items-center justify-start gap-2  p-2 border border-gray-400 rounded-xl">
          <ul className="bg-white/15 p-3 rounded-full" onClick={() => ImageRef.current.click()} >
            <LuImagePlus size={22} />
          </ul>
          <ul className="bg-white/15 p-3 rounded-full" onClick={() => ImageRef.current.click()}>
            <IoMdVideocam size={22} />
          </ul>

        </div>
        {/* images selected by the user */}

      </div>

      {/* Caption */}
      <div className="flex flex-col space-y-2   p-2 rounded-xl relative">
        <label htmlFor="caption" className="text-lg font-semibold text-gray-300">Caption  </label>
        <textarea
          onChange={(e) => {
            setWords(e.target.value.split("").length);
          }}
          ref={captionRef}
          className=" rounded-xl text-purple-700 p-3  border border-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          name="caption"
        ></textarea>
        <ul className="absolute top-0 right-3 py-1 px-2 text-xs border rounded-full border-indigo-600 text-white">{words}</ul>
      </div>

      {/* Tags */}
      <div className="flex flex-col space-y-2  p-2 rounded-xl">
        <label htmlFor="tags" className="text-lg font-semibold text-gray-300">Choose Hashtags</label>
        <textarea
          ref={tagRef}
          className=" text-purple-700
          rounded-xl p-3 focus:outline-none  border border-purple-700 focus:ring-2 focus:ring-blue-500 transition duration-300"
          name="tags"
          placeholder="#Red_flag"
        ></textarea>
      </div>

      {/* Buttons */}
      <div className="flex justify-center items-center gap-2 p-2 rounded-xl">
        {/* the image selected by the user */}
        {selectedImg.length ? (
          selectedImg.map((media, i) => (
            <ul key={i} className="relative flex items-center justify-center gap-2">
              {media.type.startsWith('image') ? (
                <img className="h-12 w-12" src={media.url} alt="" />
              ) : media.type.startsWith('video') ? (
                <video className="h-12 w-12" controls>
                  <source src={media.url} type={media.type} />
                </video>
              ) : null}
              <MdCancel onClick={() => handleMediaRemove(media)} className="absolute" color="red" />
            </ul>
          ))
        ) : null}
        {/* the post submit button */}
        {PostStatus === "pending" ? (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl px-8 py-3 
            font-semibold transition duration-300 ease-in-out animate-pulse ">Posting...</div>
        ) : (
          <button
            onClick={(e) => handlePostCreate(e)}
            disabled={words < 50}
            className={`${words>50?"bg-gradient-to-r from-indigo-600 to-purple-600 text-white":"bg-white text-black "}  rounded-xl px-8 py-3 
            font-semibold transition duration-300 ease-in-out`}
          >
            Post
          </button>
        )}

      </div>
    </div>
  );
};

export default Create_Post;
