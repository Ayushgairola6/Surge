'use client'
import axios from "axios";
import { useRef, useState ,useEffect} from 'react';
import CicularLoader from "../components/CircularLoader"
import {useSelector} from 'react-redux'
import {redirect} from "next/navigation"
const Create_Post = () => {
   
    const isLoggedIn = useSelector(state=>state.auth.isLoggedIn);

 const [PostStatus,setPostStatus]=useState("idle")

 const categoryRef= useRef();
 const titleRef = useRef();
 const ImageRef = useRef();
 const captionRef = useRef();
 const tagRef = useRef();

const token = localStorage.getItem("userdata");
  // A function that handles the change in the form and adds them in the respective key

  if(isLoggedIn===false){
  
  redirect("/Popup")
}
  // A function that creates a post
  async function handlePostCreate(e) {
    e.preventDefault();
    const form = new FormData();

    // appending all the ref values to the form
    form.append('category', categoryRef.current.value);
    form.append('title', titleRef.current.value);
    form.append('caption', captionRef.current.value);
    form.append('hashtags', tagRef.current.value);

    //  if image exists apennd to the form
   if(ImageRef.current.files[0]){
    form.append("image",ImageRef.current.files[0]);
   }
    // sending the form data to the server
    try {
      setPostStatus("pending")
      const res = await axios.post("https://surge-oyqw.onrender.com/api/feed/create", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      })
      setPostStatus("done")
      setPostStatus("idle")

      return res.data
    } catch (error) {
      alert(error)
    }
   ClearForm()
  }

 function ClearForm(){
        categoryRef.current.value = ""
      titleRef.current.value = ""  
      ImageRef.current.value = ""  
      captionRef.current.value = "" 
      tagRef.current.value = "" 
     return ;
 }



  return <>
    <form  className="h-screen p-3 rounded-xl">
      <h1 className=" text-center text-2xl font-sans font-bold ">CREATE A POST</h1>
      {/* div containing all inputs */}
      <div encType="multipart/form-data" className="relative flex flex-col justify-center items-center  w-4/5 m-auto mt-4 rounded-md border border-slate-300 shadow-sm shadow-black">

        {/* category */}
        <div className=" w-full mt-4 p-1 flex flex-col">
          <label className="text-left font-bold " htmlFor="dropdown">
            Choose a category
          </label>
          <select ref={categoryRef}  className="  border rounded-lg border-gray-500 w-full p-1" name="category" id="dropdown">
            <option className="font-semibold " value="Tech">Tech</option>
            <option className="font-semibold" value="AI">AI</option>
            <option className="font-semibold" value="Politics">Politics</option>
            <option className="font-semibold" value="Entertainment">Entertainment</option>
            <option className="font-semibold" value="Horror">Horror</option>
            <option className="font-semibold" value="other">Other</option>
          </select>
        </div>


        {/* title */}
        <div className=" w-full mt-4 p-1 flex flex-col">
          <label htmlFor="title" className="text-left font-bold ">Title</label>
          <ul>

            <input
              ref={titleRef} name="title" className="border rounded-lg border-gray-500 w-full p-1" type="text" />
          </ul>

        </div>
        {/* pick an image */}
        <div className=" w-full mt-4 p-1 flex flex-col">
          <label htmlFor="image" className="text-left font-bold ">Choose any image</label>
          <ul>
            <input
              ref={ImageRef} name="image" className="p-1 rounded-lg  w-full" type="file" />
          </ul>

        </div>
        {/* write a caption */}
        <div className=" w-full mt-4 p-1 flex flex-col">
          <label htmlFor="caption" className="text-left font-bold ">Caption</label>
          <ul className="w-full">
            <textarea
              ref={captionRef} className="border rounded-lg border-gray-500 w-full p-1" name="caption" id=""></textarea>
          </ul>

        </div>
        {/* tags */}
        <div className=" w-full mt-4 p-1 flex flex-col">
          <label htmlFor="caption" className="text-left font-bold ">Choose hashtags</label>
          <ul className="w-full">
            <textarea ref={tagRef} className="border rounded-lg border-gray-500 w-full p-1" name="tags" placeholder="#AI" id=""></textarea>
          </ul>

        </div>
        {/* buttons for actions */}
        <div className='flex items-center justify-evenly p-2  w-full'>
          {PostStatus=== "pending"? <CicularLoader/>:<button onClick={(e) => handlePostCreate(e)} className="bg-black text-white py-0 px-4 hover:bg-white hover:text-black font-semibold rounded-lg hover:border hover:border-black">Post</button>}
          <button onClick={ClearForm} className="bg-black text-white py-0 px-3 font-semibold rounded-lg hover:bg-white hover:text-black hover:border hover:border-black">Delete</button>
        </div>
      </div>

    </form>

  </>
}

export default Create_Post;