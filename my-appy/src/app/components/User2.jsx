'use client'
import {useEffect,useState } from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {Getdata} from "../../store/Moreslice"
import Link from 'next/link'
import AccountLoader from '../components/AccountLoading'
const User2 =({id})=>{


const dispatch = useDispatch();
	const Connection = useSelector(state => state.more.Account);
  

// fetch the user data based on the id sent as parameter
		useEffect(() => {
			const token = localStorage.getItem("userdata");
	      dispatch(Getdata(id,token));
		},[id,dispatch]);

 return (<>

              {Connection !== null && Connection ? (
        <div className="p-2">
          {/* User image and user details */}
          <div className="p-1 font-mono font-bold text-lg flex items-center justify-start gap-10">
            <img  className="h-32 w-32 border border-black" src={Connection.User[0].image?Connection.User[0].image : "/NoImage.jpg"}alt="" />
            {/* div containing user data button and Link */}
            <div className="flex flex-col gap-2">
              <span>{Connection.User[0].username}</span>
              <span>{Connection.User[0].email}</span>
            
              
              {/* buttons and link container*/}
              <div className="flex items-center justify-center gap-3">
              <Link className='bg-green-500  px-6 font-semibold text-md border border-black shadow-md shadow-black rounded-xl font-bold text-center' href={`/Chats/${Connection.User[0].id}`}>
                Converse
              </Link>
              </div>
              
            </div>
          </div>

          {/* container for posts of user */}
          <div className="mt-4 min-h-52 p-2 flex items-start justify-evenly gap-2 flex-wrap">
            {/* post body */}
            {Connection.posts.map((post) => (
              <div key={post.id} className="flex flex-col items-center justify-center border border-black rounded-xl min-h-56 min-w-48 max-h-56 overflow-y-scroll hide-scrollbar max-w-48 text-center font-mono font-semibold text-md text-center">
                <img className="h-[70%] w-full" src={post.image ? post.image : "/NoImage.jpg"}  alt="" />
                <span className="text-xl uppercase">{post.title}</span>
                <span>{post.body}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-[85vh] w-full flex items-center justify-center"><AccountLoader /></div>
      )}
    


	</>)
}

export default User2;