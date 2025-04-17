'use client'
import axios from "axios";
import { useRef, useState, useEffect } from 'react';
import CicularLoader from "../components/CircularLoader"
import { useSelector } from 'react-redux'
import { redirect } from "next/navigation"
import PostcreationIndicator from "../components/CreatingPostIndicator";

const Create_Post = () => {

  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  const [PostStatus, setPostStatus] = useState("idle")
  const [token, setToken] = useState(null);
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
    form.append('category', categoryRef.current.value);
    form.append('title', titleRef.current.value);
    form.append('caption', captionRef.current.value);
    form.append('hashtags', tagRef.current.value);

    if (ImageRef.current.files[0]) {
      form.append("image", ImageRef.current.files[0]);
    }
    ClearForm();

    try {
      setPostStatus("pending");
      const res = await axios.post("https://surge-oyqw.onrender.com/api/feed/create", form, {
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
      // If there was an error, clear the timeout

      throw new Error(error);
    }
  }

  function ClearForm() {
    categoryRef.current.value = "";
    titleRef.current.value = "";
    captionRef.current.value = "";
    tagRef.current.value = "";
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg space-y-6">
      <PostcreationIndicator status={PostStatus} setIsVisible={setPostStatus} />
      {/* Form title */}
      <h2 className="text-3xl font-semibold text-center text-gray-800">Create a Post</h2>

      {/* Category */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="dropdown" className="text-lg font-semibold text-gray-700">Choose Your Vibe!</label>
        <select ref={categoryRef} className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300">
          <option className="font-semibold" value="Crush Confessions">Crush Confessions</option>
          <option className="font-semibold" value="AI">AI</option>
          <option className="font-semibold" value="Green and Red flags">Green and Red flags</option>
          <option className="font-semibold" value="First Date stories">First Date stories</option>
          <option className="font-semibold" value="Gossip zone">Gossip zone</option>
          <option className="font-semibold" value="Match Me Up">Match Me Up</option>
          <option className="font-semibold" value="Breakup Corner">Breakup Corner</option><option className="font-semibold" value="Mental Check-In">Mental Check-In</option>
        </select>
      </div>

      {/* Title */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="title" className="text-lg font-semibold text-gray-700">Title</label>
        <input
          ref={titleRef}
          type="text"
          name="title"
          className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>

      {/* Image Upload */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="image" className="text-lg font-semibold text-gray-700">Choose an Image</label>
        <input
          ref={ImageRef}
          type="file"
          name="image"
          className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>

      {/* Caption */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="caption" className="text-lg font-semibold text-gray-700">Caption</label>
        <textarea
          ref={captionRef}
          className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          name="caption"
        ></textarea>
      </div>

      {/* Tags */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="tags" className="text-lg font-semibold text-gray-700">Choose Hashtags</label>
        <textarea
          ref={tagRef}
          className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          name="tags"
          placeholder="#AI #Tech"
        ></textarea>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        {PostStatus === "pending" ? (
          <CicularLoader />
        ) : (
          <button
            onClick={(e) => handlePostCreate(e)}
            className="bg-sky-600 hover:bg-sky-400 text-white rounded-xl px-8 py-3 font-semibold transition duration-300 ease-in-out"
          >
            Post
          </button>
        )}
        <button
          onClick={ClearForm}
          className="bg-white border border-gray-400 text-gray-700 rounded-xl px-8 py-3 font-semibold hover:border-gray-600 transition duration-300 ease-in-out"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Create_Post;
