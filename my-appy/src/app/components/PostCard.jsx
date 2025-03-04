'use client'
import axios from "axios";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UseStore } from "@/store/store";
import {GetChats,GetRoomSpecificChats} from '@/store/ChatSlice';
import {GetAccount,VerifyAccount} from '@/store/AuthSlice'
import {useDispatch,useSelector} from 'react-redux';
import LoadingCard from './loadingCard'
const PostCard = () => {
    // getting the user chats 
    
    

    const dispatch = useDispatch();
        useEffect(()=>{
            dispatch(VerifyAccount());
        //  dispatch(GetChats());
        //  dispatch(GetAccount());
        },[dispatch])
      const [currHover,setCurrHover] = useState(null);  

    // getting context of current tab being used by the user
    const { currTab ,posts,setPosts} = UseStore();
 
    useEffect(() => {
        axios.get(`http://localhost:8080/api/feed/posts/${currTab}`).then(res => {
            console.log(res.data);
            setPosts(res.data);
        }).catch(error => {
            alert(error);
        })
    }, [])


    // functions to handle appearance and disappearance of the directive arrow in while hovering over the post

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

    function addFallbackImage(event){
        event.target.src = "./NoImage.jpg"

    }



    return (<>
        {/* post container */}<div className="container min-h-screen mx-auto p-2">
        {posts !== null ? <div  className=" flex flex-wrap justify-center gap-4">
            {posts.map((post, index) => {
                return <>
                    {/* postcard body */}
                  <div  onMouseEnter={()=>whenOver(post)} onMouseLeave={()=>whenOut(post)} key={post.id} className="  rounded-xl relative min-h-72 h-72 max-h-72
                                      overflow-y-scroll   text-center p-1 font-serif border-2 border-black hover:shadow-md hover:shadow-black w-64 hide-scrollbar">
                                                                                       {post===currHover?<Link className="absolute right-2 top-2 inline-flex items-center justify-center bg-green-500 px-2 rounded-xl flex items-center justify-center border gap-2 border-black" href={`/DetailedPost/${post.id}`}>
                                                                                       Read
                                                                              <ArrowUpRight  className="bg-black font-extrabold text-white rounded-full " size={17} />
                                                                              
                                                                          </Link>:null}
                                         
                                          {/* post image */}
                                         
                                          <img className="h-[70%] w-full" onError={addFallbackImage} src={post.image?post.image:"/NoImage.jpg"} alt="\" />
                                           {/*Post title*/}
                                          <span className="flex items-center justify-between gap-3   "> <h3 className="text-lg font-mono uppercase text-center font-bold">{post.title}</h3> </span>

                                          {/* description */}
                  
                                          <p>
                                              {post.body}
                                          </p>
                                           
                                      </div>
                                     

                </>
            })}

        </div> : <div className="h-screen w-full flex items-center justify-center ">
            
            <h1 className="font-bold text-3xl font-mono animate-pulse">LOADING...</h1>
        </div>
        }
        </div>

    </>)
}

export default PostCard;