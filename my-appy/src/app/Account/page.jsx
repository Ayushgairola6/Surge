'use client'
import Image from "next/image";
import { GetAccount, UploadProfilePic } from "@/store/AuthSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from 'react';
import AccountLoader from '../components/AccountLoading';
import Link from 'next/link';

const UserAccount = () => {
  const [chosenImage, setChosenImage] = useState(null);
  const dispatch = useDispatch();

  // loading user data from api
  useEffect(() => {
    dispatch(GetAccount());
  }, [dispatch]);

  const User = useSelector(state => state.auth.user);
  const imageRef = useRef();

  // function to add profile image
  function handleImage_upload() {
    const form = new FormData();
    if (!imageRef.current.files[0]) {
      alert("please select an image first");
      return;
    }
    console.log(imageRef.current.files[0]);
    form.append("image", imageRef.current.files[0]);
    dispatch(UploadProfilePic(form));
    setChosenImage(null);
  }

  // handle image preview
  function handleInputChange(e) {
    const file = imageRef.current.files[0];
    if (!file) {
      alert("please select an image first");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setChosenImage(event.target.result);
      console.log(chosenImage);
    };
    reader.readAsDataURL(file);
  }

  // trigger image input
  function handleInputTrigger() {
    imageRef.current.click();
  }

  // addFallbackImage
  function addFallbackImage(event) {
    event.target.src = "/NoImage.jpg";
  }

  return (
    <>
      {User !== null && User ? (
        <div className="p-2">
          {/* User image and user details */}
          <div className="p-1 font-mono font-bold text-lg flex items-center justify-start gap-10">
            <img onClick={handleInputTrigger} className="h-32 w-32 border border-black" src={User.User[0].image ? User.User[0].image : "/NoImage.jpg"} alt="" />
            {/* div containing user data button and Link */}
            <div className="flex flex-col gap-2">
              <span>{User.User[0].username}</span>
              <span>{User.User[0].email}</span>
              {chosenImage !== null ? <img className="h-12 w-12" src={chosenImage} alt="" /> : null}
              <input onChange={handleInputChange} className="text-xs hidden" ref={imageRef} type="file" />
              {/* buttons and link container*/}
              <div className="flex items-center justify-center gap-3">
                  <button onClick={handleImage_upload} className='bg-green-500  px-6 rounded-xl font-bold border border-black shadow-md shadow-black rounded-xl'>UploadImage</button>
              <Link className='bg-green-500  px-6 font-semibold text-md border border-black shadow-md shadow-black rounded-xl font-bold text-center' href={`/Chats/${User.User[0].id}`}>
                Converse
              </Link>
              </div>
              
            </div>
          </div>

          {/* container for posts of user */}
          <div className="mt-4 min-h-52 p-2 flex items-start justify-evenly gap-2 flex-wrap">
            {/* post body */}
            {User.posts.map((post) => (
              <div key={post.id} className="flex flex-col items-center justify-center border border-black rounded-xl min-h-56 min-w-48 max-h-56 overflow-y-scroll hide-scrollbar max-w-48 text-center font-mono font-semibold text-md text-center">
                <img className="h-[70%] w-full" src={post.image ? post.image : "/NoImage.jpg"} onError={addFallbackImage} alt="" />
                <span className="text-xl uppercase">{post.title}</span>
                <span>{post.body}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-[85vh] w-full flex items-center justify-center"><AccountLoader /></div>
      )}
    </>
  );
}

export default UserAccount;
