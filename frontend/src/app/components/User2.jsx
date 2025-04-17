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
      <div className="p-4 max-w-screen-xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-yellow-300 to-pink-300 p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-center gap-4">
          <img
            className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-white shadow-lg object-cover"
            src={Connection.User[0].image ? Connection.User[0].image : "/NoImage.jpg"}
            alt="User Profile"
          />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-gray-800">{Connection.User[0].username}</span>
            <span className="text-sm sm:text-base text-gray-700">{Connection.User[0].email}</span>

            {/* Chat Button */}
            {user !== null && Connection.User[0].id !== user.User[0].id && (
              <div className="mt-3">
                <Link
                  className="bg-green-600 text-white px-5 py-1 rounded-full font-semibold shadow hover:bg-green-700 transition"
                  href={`/Chats/${Connection.User[0].id}`}
                >
                  Chat
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Connection.posts.map((post) => (
            <div
              key={post.id}
              onMouseEnter={() => whenOver(post)}
              onMouseLeave={() => whenOut(post)}
              className="group relative bg-white rounded-xl shadow-lg overflow-hidden"
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
                    className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow hover:bg-green-700 transition"
                  >
                    Read <ArrowUpRight size={16} />
                  </Link>
                )}
              </div>

              {/* Post Content */}
              <div className="p-4 space-y-2 flex flex-col justify-between h-36">
                <h3 className="text-lg font-bold text-gray-800 truncate">{post.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{post.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div onClick={() => console.log(Connection)} className="min-h-screen flex items-center justify-center">
        <AccountLoader />
      </div>
    )}



  </>)
}

export default User2;