'use client'
import {useEffect,useState } from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {Getdata} from "../../store/Moreslice"
import Link from 'next/link'
import AccountLoader from '../components/AccountLoading'
import { ArrowUpRight } from "lucide-react";
import {useRouter } from 'next/navigation';
const User2 =({id})=>{
const router = useRouter();

const dispatch = useDispatch();
	const Connection = useSelector(state => state.more.Account);
  const user = useSelector(state=>state.auth.user);
  const isLoggedIn = useSelector(state=>state.auth.isLoggedIn);
  const [currHover,setCurrHover] = useState(null);  
   

  
// fetch the user data based on the id sent as parameter
		useEffect(() => {
			const token = localStorage.getItem("userdata");
	      dispatch(Getdata(id,token));
		},[id,dispatch]);

    
    function whenOver(post){
      if(post){
      setCurrHover(post);            
      }else{
          return
      }
  }

  function whenOut(post){
      if(post){
   setCurrHover(!post)       
      }else{
          return
      }
   
  }

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
              <div  className="flex items-center justify-center gap-3">
              {user!==null&&Connection.User[0].id!==user.User[0].id?<Link  className='bg-green-500  px-6 font-semibold text-md border border-black shadow-md shadow-black rounded-xl font-bold text-center' href={`/Chats/${Connection.User[0].id}`}>
                Chat
              </Link>:null}
              </div>
              
            </div>
          </div>

          {/* container for posts of user */}
          <div className="mt-4 min-h-52 flex flex-wrap justify-center items-center gap-4 md:items-normal md:justify-normal">
            {/* post body */}
            {Connection.posts.map((post) => (
              <div  onMouseEnter={()=>whenOver(post)} onMouseLeave={()=>whenOut(post)} key={post.id} className="  rounded-xl relative min-h-72 h-72 max-h-72
              overflow-y-scroll relative  text-center p-1 font-serif border-2 border-black hover:shadow-md hover:shadow-black w-64 hide-scrollbar">
                                                               {post===currHover?<Link className="absolute right-2 top-2 inline-flex items-center justify-center bg-green-500 px-2 rounded-xl flex items-center justify-center border gap-2 border-black" href={`/DetailedPost/${post.id}`}>
                                                               Read
                                                      <ArrowUpRight  className="bg-black font-extrabold text-white rounded-full " size={17} />
                                                      
                                                  </Link>:null}
                 
                  {/* post image */}
                 
                  <img className="h-[70%] w-full"  src={post.image?post.image:"/NoImage.jpg"} alt="\" />
                   {/*Post title*/}
                  <span className="flex items-center justify-between gap-3   "> <h3 className="text-lg font-mono uppercase text-center font-bold">{post.title}</h3> </span>

                  {/* description */}

                  <p>
                      {post.body}
                  </p>
                   <div className="bg-black/30 absolute w-full "></div>
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