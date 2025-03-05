'use client'
import {useEffect,useState,useRef} from 'react';
import {GetChats,GetRoomSpecificChats} from '../../store/ChatSlice';
import {GetAccount} from '../../store/AuthSlice'
import {useDispatch,useSelector} from 'react-redux';
import {io} from 'socket.io-client';

import Link from 'next/link'
const AllChats =()=>{

const messageInput = useRef();
// a bunch of variables
 const dispatch = useDispatch();
   const chats = useSelector(state=>state.chat.chats);
   const roomdata = useSelector(state=>state.chat.chatData);
   const User = useSelector(state=>state.auth.user);
  const [room_name,setRoomname]=useState(chats[0].room_name)
const userid = User!==null?User.User[0].id:null;
 const [messages,setMessage]=useState([]);
 let user2 = useRef(null)
   
useEffect(()=>{
dispatch(GetChats())
},[dispatch])


// if the userchats available we are fetching message of first user_room;
 useEffect(()=>{
 	if(chats){

 		dispatch(GetRoomSpecificChats(chats[0].room_name))
 	}
 },[dispatch,chats])


// a bunch of states to handle socket related data
const socket = useRef(null);



useEffect(()=>{
	const token = localStorage.getItem("userdata");
	try{
	 if(!token){
	  return ;
	 }
	 //socket port
	  socket.current = io("http://localhost:8080",{
		auth:{token},
	  })
	// connecting to the socket 
	socket.current.on("connection",()=>{
		console.log("Socket connection has been established");
	  })
	// listening to the updated messages that are being currently listened
  
	socket.current.on("newMessage",(data)=>{
		console.log(data)
		setMessage((prev)=>(Array.isArray(prev) ? [...prev, data] : [data]))
	})
	
  
	}catch(error){
	  throw error;
	}
  
	return () => {
	  socket.current.disconnect();
	};
  },[io])

  
// function which fetch chats when room id clicked on
  const GetRoomData=(chat)=>{
  setRoomname(chat.room_name);
  
  // get room related data;
  dispatch(GetRoomSpecificChats(chat.room_name));
  }


  function SendMessage(){ 
	if(!socket.current)return;
	if(roomdata.length!==0){
		const lastMessage = roomdata[roomdata.length-1];
		if(lastMessage.sender_id === User.User[0].id){
			user2 = lastMessage.receiver_id
		}else{
			user2 = lastMessage.sender_id
		}
		return
	}
	socket.current.emit("message",({roomName:roomName, user1:User.User[0].id, user2:user2,message:messageInput.current.value}))
  }
 

	return(
		<>
		<div className=" flex items-center justify-center h-screen">
			 {chats!==null? <div onClick={()=>console.log(roomdata)} className="flex items-normal justify-normal flex-col h-full w-[40%] p-2 gap-3 ">
			 			{/*chat rooms*/}
			 		{[...chats,messages].map((chat,index)=>{
			 			return (<>
			 			
			 				<div onClick={()=>{
			 					GetRoomData(chat)
			 				}} key={index} className=" border border-gray-400 py-1 px-2 rounded-full flex items-center justify-between  ">
			 			 	 	{chat.room_name}
			 			 	 	<img className="h-10 w-10 border-2 border-green-400 rounded-full" src="/NoImage.jpg"/>
			 			 	 </div>

			 			</>)
			 				
			 		})}
			 			 	 
			 
			 			 	  
			 			 </div>:<div  className="border border-gray-400 py-1 px-2 rounded-full flex items-center justify-between animate-pulse ">
			 			 	 	message
			 			 	 	<img className="h-10 w-10 border-2 border-green-400 rounded-full" src="/NoImage.jpg"/>
			 			 	 </div>}
			 			 	{/*chats of currrently seclected chatsessions or room*/}
			 			 	 {roomdata!==null?<div  className="flex flex-col items-normal justify-between h-screen w-full border border-gray-400  rounded-xl  overflow-auto py-4 ">
			 			 	                 {[...roomdata, ...messages].map((chat,index)=>{
			 			 	                 	return (<>                   
			 			 	                 	<div className={`${chat.sender_id===userid?'text-left':'text-right'} `} key={index}>    
			 			 	                 	<ul className={`font-bold`}>{chat.sender_name}</ul>         
			 			 	                 		<ul >{chat.message}</ul>

			 			 	                 		</div>
			 			 	                    
			 			 	                 	</>)
			 			 	                 })}
			 			                  	 <div className=" flex items-center justify-evenly p-2  w-full ">
			 			 	                    	<input ref={messageInput} className="w-72 border border-slate-400 rounded-xl font-bold p-1" placeholder="Your message" type='text'/>
			 			 	                    	<button onClick={()=>{
														SendMessage()
													}} className="bg-sky-400 px-4 py-1 text-lg rounded-xl shadow-sm shadow-black text-gray-300 font-bold">Send</button>
			 			 	                    </div>
			 			 	               
			 			 	 			 			 	 </div>:null}

</div>
		</>
 )
}


export default AllChats;