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

const userid = User!==null?User.User[0].id:null;

   
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
const [socket ,setSocket] = useState(null);
const [messages,setMessage] =useState([]);
const room = chats?chats[0].room_name:null;
const room_id = chats?chats[0].room_id:null;
const [roomName,setRoomname] = useState(room);
const [roomid,setRoomId] = useState(room_id);
const [username, setUsername] = useState(null);
const [receipent,setReceipent] = useState(null);
const [userId,setUserId] =useState(null);
 const token = localStorage.getItem("userdata");



// connecting to the websocket
useEffect(()=>{

 const socketIo = io("http://localhost:4000", { auth: { token: token } });
  setSocket(socketIo);
// Join a room (example)
socketIo.emit("joinByRoomName",{roomName,userid,roomid});

socketIo.on("room_message",(message)=>{
	setMessage((prev)=>[...prev,message]);
})
return ()=>{
	socketIo.disconnect();
}

},[ token])

  
// function which fetch chats when room id clicked on
  const GetRoomData=(chat)=>{
  alert(chat) ;
  setRoomname(chat.room_name);
  setRoomId(chat.room_id);
  // get room related data;
  dispatch(GetRoomSpecificChats(chat.room_name));
  }


  
 

	return(
		<>
		<div className=" flex items-center justify-center h-screen">
			 {chats!==null? <div onClick={()=>console.log(roomdata)} className="flex items-normal justify-normal flex-col h-full w-[40%] p-2 gap-3 ">
			 			{/*chat rooms*/}
			 		{chats.map((chat,index)=>{
			 			return (<>
			 			
			 				<div onClick={()=>{
			 					GetRoomData(chat)
			 				}} key={index} className=" border border-gray-400 py-1 px-2 rounded-full flex items-center justify-between  ">
			 			 	 	{chat.room_name}
			 			 	 	<img className="h-10 w-10 border-2 border-green-400 rounded-full" src="/NoImage.jpg"/>
			 			 	 </div>

			 			</>)
			 				
			 		})}
			 			 	 
			 
			 			 	  
			 			 </div>:<div  className=" border border-gray-400 py-1 px-2 rounded-full flex items-center justify-between animate-pulse ">
			 			 	 	message
			 			 	 	<img className="h-10 w-10 border-2 border-green-400 rounded-full" src="/NoImage.jpg"/>
			 			 	 </div>}
			 			 	{/*chats of currrently seclected chatsessions or room*/}
			 			 	 {roomdata!==null?<div  className="h-full w-full border border-red-500 rounded-md  overflow-auto p-2">
			 			 	                 {[...roomdata, ...messages].map((chat,index)=>{
			 			 	                 	return (<>                   
			 			 	                 	<div className={`'text-right':'text-left'} `} key={index}>    
			 			 	                 	<ul className={`font-bold`}>{chat.username}</ul>         
			 			 	                 		<ul >{chat.message}</ul>

			 			 	                 		</div>
			 			 	                    
			 			 	                 	</>)
			 			 	                 })}
			 			                  	 <div className="border border-red-500 flex items-center justify-evenly p-2  bottom-1 w-full bg-black">
			 			 	                    	<input ref={messageInput} className="border border-slate-400 rounded-xl font-bold p-1" placeholder="Your message" type='text'/>
			 			 	                    	<button onClick={()=>{
			 			 	                    		if (socket) {
					 socket.emit("room_message", {roomName: roomName,
					 	roomId:roomid,
						 message: messageInput.current.value,
						 userid:userid,
						
						 })
						messageInput.current.value = "" }
			 			 	                    	}} className="bg-gradient-to-r from-green-500 to-purple-500 w-[4rem] rounded-xl shadow-sm shadow-purple-400 font-bold">Send</button>
			 			 	                    </div>
			 			 	               
			 			 	 			 			 	 </div>:null}

</div>
		</>
 )
}


export default AllChats;