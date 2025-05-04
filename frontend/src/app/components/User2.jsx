'use client'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Getdata } from "../../store/Moreslice"
import Link from 'next/link'
import AccountLoader from '../components/AccountLoading'
import { ArrowUpRight } from "lucide-react";
import { useRouter } from 'next/navigation';
const User2 = ({ id }) => {
  const router = useRouter();

  const dispatch = useDispatch();
  const Connection = useSelector(state => state.more.Account);
  const user = useSelector(state => state.auth.user);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const [currHover, setCurrHover] = useState(null);



  // fetch the user data based on the id sent as parameter
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    dispatch(Getdata(id));
  }, [id, dispatch]);


  function whenOver(post) {
    if (post) {
      setCurrHover(post);
    } else {
      return
    }
  }

  function whenOut(post) {
    if (post) {
      setCurrHover(!post)
    } else {
      return
    }

  }

  return (<>

    {Connection !== null && Connection ? (
      <div className="p-4 max-w-screen min-h-screen bg-black text-white mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-bl from-purple-900  to-black p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-normal justify-start gap-4 border border-gray-500">
          <img
            className="h-24 w-24 sm:h-28 sm:w-28 rounded-full  border-2 border-indigo-600 shadow-lg object-cover"
            src={Connection.User[0].image ? Connection.User[0].image : "/NoImage.jpg"}
            alt="User Profile"
          />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700">{Connection.User[0].username}</span>
            {/* <span className="text-sm sm:text-base text-gray-700">{Connection.User[0].email}</span> */}

            {/* Chat Button */}
            {user !== null && Connection.User[0].id !== user.User[0].id && (
              <div className="mt-4">
                <Link
                  className="hover:bg-black hover:text-white font-semibold px-4 py-1 rounded-full    transition duration-300 bg-white text-black hover:shadow-md hover:shadow-indigo-700"
                  href={`/Chats/${Connection.User[0].id}`}
                >
                  Chat
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className='w-full bg-gradient-to-r from-white/15 to-white/5 py-2 px-4 flex items-normal justify-normal gap-3 cursor-pointer rounded-xl'>
          <ul className="rounded-xl px-2 py-1 bg-gradient-to-r from-indigo-700 to-purple-700">Posts</ul>
         

        </div>
        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Connection.posts.map((post) => (
            <div
              key={post.id}
              onMouseEnter={() => whenOver(post)}
              onMouseLeave={() => whenOut(post)}
              className="group relative bg-gradient-to-r from-white/5 to-white/15 rounded-xl shadow-lg overflow-hidden"
            >
              {/* Post Image */}
              <div className="relative">
                <img
                  className="h-40 w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  src={post.image ? post.image : "/NoImage.jpg"}
                  alt={post.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>

                {/* Read Button */}
                {post === currHover && (
                  <Link
                    href={`/DetailedPost/${post.id}`}
                    className="absolute top-3 right-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow transition-all"
                  >
                    Read <ArrowUpRight size={16} />
                  </Link>
                )}
              </div>

              {/* Post Content */}
              <div className="p-4 space-y-2 flex flex-col justify-between h-36">
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700 truncate">{post.title}</h3>
                <p className="text-sm text-gray-300 line-clamp-3">{post.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div  className="min-h-screen bg-black flex items-center justify-center">
        <AccountLoader />
      </div>
    )}



  </>)
}

export default User2;