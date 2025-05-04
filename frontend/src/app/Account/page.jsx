'use client'
import Image from "next/image";
import { GetAccount, UploadProfilePic } from "@/store/AuthSlice";
import { DeletPost, ChooseToDelete } from '@/store/postSlice';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import AccountLoader from '../components/AccountLoading';
import Link from 'next/link';
import { ArrowUpRight } from "lucide-react";
import { FaLock } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import { IoCreateSharp } from "react-icons/io5";
import PostMenu from "../components/postOptionMenu";
import { useRouter } from "next/navigation";

const UserAccount = () => {
  const [chosenImage, setChosenImage] = useState(null);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const router = useRouter();
  const deltedStatus = useSelector(state => state.posts.postDeleting);
  const chosenPost = useSelector(state => state.posts.post_to_delete);
  const uploadStatus = useSelector(state => state.auth.isUploading);
  const [currPost, setCurrPost] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !isLoggedIn) {
      router.push("/Popup");
    }
  }, [isLoggedIn, router])
  // Load user data when component mounts
  useEffect(() => {
    dispatch(GetAccount());
  }, [dispatch]);

  const User = useSelector(state => state.auth.user);
  const imageRef = useRef();

  // Handle profile image upload
  const handleImage_upload = () => {
    const form = new FormData();
    if (!imageRef.current.files[0]) {
      // alert("Please select an image first");
      return;
    }
    form.append("image", imageRef.current.files[0]);
    dispatch(UploadProfilePic(form));
    setChosenImage(null);
  }

  // Handle image preview after selection
  const handleInputChange = () => {
    const file = imageRef.current.files[0];
    if (!file) {
      // alert("Please select an image first");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setChosenImage(event.target.result);
    };
    reader.readAsDataURL(file);
  }

  // Trigger hidden file input
  const handleInputTrigger = () => {
    imageRef.current.click();
  }

  // Fallback image for broken image links
  const addFallbackImage = (event) => {
    event.target.src = "/NoImage.jpg";
  }


  function DeleteImage(post) {
    if (!post) return;
    const post_id = post.id;
    dispatch(DeletPost(post_id))
    dispatch(ChooseToDelete(post_id));
  }

  return (
    <>
      {User !== null && User ? (
        <div className="p-4 max-w-screen min-h-screen bg-black text-white mx-auto space-y-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-bl from-purple-900  to-black p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-normal justify-start gap-4">
            <div className="relative">
              <img
                onClick={handleInputTrigger}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-indigo-600 shadow-lg cursor-pointer transition transform hover:scale-105"
                src={User.User[0].image ? User.User[0].image : "/NoImage.jpg"}
                alt="Profile Picture"
              />
              {chosenImage && (
                <img
                  className="absolute inset-0 h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-indigo-600 shadow-lg"
                  src={chosenImage}
                  alt="Chosen Preview"
                />
              )}
              <input onChange={handleInputChange} ref={imageRef} className="hidden" type="file" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700">{User.User[0].username}</span>
              <span className="text-sm sm:text-base text-white">{User.User[0].email}</span>
              <div className="mt-2">
                {uploadStatus !== "pending" ? (
                  <button
                    onClick={handleImage_upload}
                    className="hover:bg-black hover:text-white font-semibold px-4 py-1 rounded-full    transition duration-300 bg-white text-black hover:shadow-md hover:shadow-indigo-700"
                  >
                    Upload Image
                  </button>
                ) : (
                  <div className="flex items-center justify-center">
                    <div className="h-10 w-10 border-t-2 border-white rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='w-full bg-gradient-to-r from-white/15 to-white/5 py-2 px-4 flex items-normal justify-normal gap-3 cursor-pointer rounded-xl'>
            <ul className="rounded-xl px-2 py-1 bg-gradient-to-r from-indigo-700 to-purple-700">Posts</ul>
            <ul className="rounded-xl px-2 py-1 bg-gradient-to-r from-indigo-700 to-purple-700 flex items-center justify-center gap-2">Analytics <FaLock /></ul>
            <ul className="rounded-xl px-2 py-1 bg-gradient-to-r from-indigo-700 to-purple-700 flex items-center justify-center gap-2">More
              <FaLock />
            </ul>

          </div>
          {/* Posts Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {User.posts.length > 0 ? User.posts.map((post) => (
              <div onMouseEnter={() => {
                setCurrPost(post.id)
              }}
                onMouseLeave={() => {
                  setVisible(false)

                  setCurrPost(null)
                }}
                key={post.id} className="group relative bg-gradient-to-r from-white/5 to-white/15 rounded-xl shadow-lg overflow-hidden">


                {/* Card Image Section */}
                <div className="relative">
                  <img
                    className="h-40 w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                    onError={addFallbackImage}
                    src={post?.media_urls.length > 0 ? post.media_urls[0] : "/NoImage.jpg"}
                    alt={post.title}
                  />
                  {/*the menu for other post options  */}
                  <ul onClick={() => {
                    if (currPost === post.id) {
                      setVisible(!visible)
                    }
                    // console.log(currPost)
                  }} className="absolute top-4 right-4 z-[999]"><CiMenuKebab color="black" size={22} />
                    {currPost === post.id && visible === true ? <PostMenu DeleteImage={DeleteImage} post_id={post} /> : null}
                  </ul>
                  {/* post deletion indicator */}
                  {deltedStatus === "pending" && chosenPost === post.id ? <div className="absolute top-0 left-0 h-full w-full  flex items-center justify-center">
                    <div className=" h-20 w-20 border-t-4 border-indigo-600 animate-spin rounded-full duration-500 z-[999]"></div>
                  </div> : null}

                  {/* Gradient overlay for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
                  {/* Post title over image */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <h3 className="text-lg font-bold text-white truncate">{post.title}</h3>
                  </div>
                </div>
                {/* Card Content Section */}
                <div className="p-4 space-y-2 flex flex-col justify-between h-36">
                  <p className="text-sm text-gray-300 line-clamp-3">
                    {post.body}
                  </p>
                  <Link
                    href={`/DetailedPost/${post.id}`}
                    className="mt-2 inline-flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700 transition-colors duration-300"
                  >
                    Read <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            )) : <div className="flex items-center justify-center h-[50vh] flex-col gap-3 ">
              <span className="text-purple-500">You currently do not have any posts</span>
              <Link href="/createPost" className="py-1 px-4 rounded-full flex items-center justify-center gap-2">Start Posting <IoCreateSharp/></Link>
            </div>}
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <AccountLoader />
        </div>
      )}
    </>
  );
}

export default UserAccount;
