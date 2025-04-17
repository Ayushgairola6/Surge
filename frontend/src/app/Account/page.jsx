// 'use client'
// import Image from "next/image";
// import { GetAccount, UploadProfilePic } from "@/store/AuthSlice";
// import { useSelector, useDispatch } from "react-redux";
// import { useEffect, useRef, useState } from 'react';
// import AccountLoader from '../components/AccountLoading';
// import Link from 'next/link';
// import { ArrowUpRight } from "lucide-react";

// const UserAccount = () => {
//   const [chosenImage, setChosenImage] = useState(null);
//   const dispatch = useDispatch();
//   const [currHover,setCurrHover] = useState(null);  
//   const uploadStatus = useSelector(state=>state.auth.isUploading);
//   // loading user data from api
//   useEffect(() => {
//     dispatch(GetAccount());
//   }, [dispatch]);

//   const User = useSelector(state => state.auth.user);
//   const imageRef = useRef();

//   // function to add profile image
//   function handleImage_upload() {
//     const form = new FormData();
//     if (!imageRef.current.files[0]) {
//       alert("please select an image first");
//       return;
//     }
//     console.log(imageRef.current.files[0]);
//     form.append("image", imageRef.current.files[0]);
//     dispatch(UploadProfilePic(form));
//     setChosenImage(null);
//   }

//   // handle image preview
//   function handleInputChange(e) {
//     const file = imageRef.current.files[0];
//     if (!file) {
//       alert("please select an image first");
//       return;
//     }
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setChosenImage(event.target.result);
//       console.log(chosenImage);
//     };
//     reader.readAsDataURL(file);
//   }

//   // trigger image input
//   function handleInputTrigger() {
//     imageRef.current.click();
//   }

//   // addFallbackImage
//   function addFallbackImage(event) {
//     event.target.src = "/NoImage.jpg";
//   }

//   function whenOver(post){
//     if(post){
//     setCurrHover(post);            
//     }else{
//         return
//     }
// }

// function whenOut(post){
//     if(post){
//  setCurrHover(!post)       
//     }else{
//         return
//     }
//   }

//   return (
//     <>
//       {User !== null && User ? (
//         <div className="p-2 max-w-screen whitespace-wrap">
//           {/* User image and user details */}
//           <div className="py-3 font-mono font-bold text-sm flex flex-col items-start justify-start gap-3 w-full border-b border-black">
//           <div className="flex flex-col items-center justify-center gap-4">
//             <img onClick={handleInputTrigger} className="h-32 w-32 border border-black rounded-xl shadow-lg shadow-black" src={User.User[0].image ? User.User[0].image : "/NoImage.jpg"} alt="" />
//             <div className="flex flex-col items-start justify-start">
//             <span>{User.User[0].username}</span>
//               <span>{User.User[0].email}</span>
//               </div>
//               </div>
//             {/* div containing user data button and Link */}
//             <div className="flex  gap-2 flex-col text-sm">
              
//               {chosenImage !== null ? <img className="h-12 w-12" src={chosenImage} alt="" /> : null}
//               <input onChange={handleInputChange} className="text-xs hidden" ref={imageRef} type="file" />
//               {/* buttons and link container*/}
//               <div className="flex flex-col items-center justify-center gap-3  ">
//                   {uploadStatus!=="pending"?<button onClick={handleImage_upload} className='bg-green-500  px-6 font-bold border border-black shadow-md shadow-black rounded-xl'>UploadImage</button>:<div className= "px-6 py-3 w-full flex items-center justify-center"><div className="m-auto h-12 w-12 rounded-full border-t-2 border-sky-600 animate-spin"></div></div>}
//               {/* <Link className='bg-sky-500  px-6  font-bold border border-black shadow-md shadow-black rounded-xl' href={`/Chats/${User.User[0].id}`}>
//                 Chat 
//               </Link> */}
//               </div>
              
//             </div>
//           </div>

//           {/* container for posts of user */}
//           <div className="mt-4 min-h-52 flex flex-wrap justify-center items-center gap-4 md:items-normal md:justify-normal">
//             {/* post body */}
//             {User.posts.map((post) => (
//                  <div  onMouseEnter={()=>whenOver(post)} onMouseLeave={()=>whenOut(post)} key={post.id} className="  rounded-xl  min-h-72 h-72 max-h-72
//                  overflow-y-scroll relative  text-center p-1 font-serif border-2 border-black hover:shadow-md hover:shadow-black w-64 hide-scrollbar">
//                                                                   {post===currHover?<Link className="absolute right-2 top-2  bg-green-500 px-2 rounded-xl flex items-center justify-center border gap-2 border-black" href={`/DetailedPost/${post.id}`}>
//                                                                   Read
//                                                          <ArrowUpRight  className="bg-black font-extrabold text-white rounded-full " size={17} />
                                                         
//                                                      </Link>:null}
                    
//                      {/* post image */}
                    
//                      <img className="h-[70%] w-full" onError={addFallbackImage} src={post.image?post.image:"/NoImage.jpg"} alt="\" />
//                       {/*Post title*/}
//                      <span className="flex items-center justify-between gap-3   "> <h3 className="text-lg font-mono uppercase text-center font-bold">{post.title}</h3> </span>

//                      {/* description */}

//                      <p>
//                          {post.body}
//                      </p>
//                       <div className="bg-black/30 absolute w-full "></div>
//                  </div>
                
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="h-[85vh] w-full flex items-center justify-center"><AccountLoader /></div>
//       )}
//     </>
//   );
// }

// export default UserAccount;
'use client'
import Image from "next/image";
import { GetAccount, UploadProfilePic } from "@/store/AuthSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import AccountLoader from '../components/AccountLoading';
import Link from 'next/link';
import { ArrowUpRight } from "lucide-react";

const UserAccount = () => {
  const [chosenImage, setChosenImage] = useState(null);
  const dispatch = useDispatch();
  const uploadStatus = useSelector(state => state.auth.isUploading);
  
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
      alert("Please select an image first");
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
      alert("Please select an image first");
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
  
  return (
    <>
      {User !== null && User ? (
        <div className="p-4 max-w-screen-xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-pink-500 to-lime-500 p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              <img 
                onClick={handleInputTrigger} 
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-white shadow-lg cursor-pointer transition transform hover:scale-105" 
                src={User.User[0].image ? User.User[0].image : "/NoImage.jpg"} 
                alt="Profile Picture" 
              />
              {chosenImage && (
                <img 
                  className="absolute inset-0 h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-white shadow-lg" 
                  src={chosenImage} 
                  alt="Chosen Preview" 
                />
              )}
              <input onChange={handleInputChange} ref={imageRef} className="hidden" type="file" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold text-white">{User.User[0].username}</span>
              <span className="text-sm sm:text-base text-white">{User.User[0].email}</span>
              <div className="mt-2">
                {uploadStatus !== "pending" ? (
                  <button 
                    onClick={handleImage_upload} 
                    className="bg-green-800 text-white font-semibold px-4 py-1 rounded-full border border-white shadow-sm transition duration-300 hover:bg-green-700"
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
          
          {/* Posts Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {User.posts.map((post) => (
              <div key={post.id} className="group relative bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Card Image Section */}
                <div className="relative">
                  <img 
                    className="h-40 w-full object-cover transform transition-transform duration-300 group-hover:scale-105" 
                    onError={addFallbackImage} 
                    src={post.image ? post.image : "/NoImage.jpg"} 
                    alt={post.title} 
                  />
                  {/* Gradient overlay for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
                  {/* Post title over image */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <h3 className="text-lg font-bold text-white truncate">{post.title}</h3>
                  </div>
                </div>
                {/* Card Content Section */}
                <div className="p-4 space-y-2 flex flex-col justify-between h-36">
                  <p className="text-sm text-gray-700 line-clamp-3">
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
            ))}
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
