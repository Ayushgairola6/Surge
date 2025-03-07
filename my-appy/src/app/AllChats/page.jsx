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
  const [room_name,setRoomname]=useState(null)
const userid = User?.User?.[0]?.id ?? null;
const [senderName, setSenderName] = useState(User?.User?.[0]?.username ?? "");
 const [messages,setMessage]=useState([]);
 const [user2,setUser2] = useState(null)
useEffect(()=>{
	if(User){
dispatch(GetChats())		
	}
},[dispatch])


// if the userchats available we are fetching message of first user_room;
 useEffect(()=>{
 	if(chats){

 		dispatch(GetRoomSpecificChats(chats[0].room_name))
 	}
 },[dispatch,chats])


 useEffect(()=>{
	if(roomdata !== null && User?.User?.[0]?.id ){
		const lastMessage = roomdata[roomdata.length-1];
		if(lastMessage.sender_id === User.User[0].id){
			setUser2(lastMessage.receiver_id)
		}else{
			setUser2(lastMessage.sender_id)
		}
	}
},[roomdata]);

useEffect(()=>{
	if(chats!==null){
	setRoomname(chats[0].room_name);
	}
},[chats])


// a bunch of states to handle socket related data
const socket = useRef(null);



useEffect(()=>{
	const token = localStorage.getItem("userdata");
	if(!token){
		return ;
	   }
	try{

	  
	  socket.current = io("https://surge-oyqw.onrender.com",{
		auth:{token},
	  })
	// connecting to the socket 
	socket.current.on("connect",()=>{
	  })
	//   joining in a room
  socket.current.emit("joinChat", { selectedUser:user2 });
	// listening to the updated messages that are being currently listened
	socket.current.on("newMessage",(data)=>{
		setMessage((prev)=>(Array.isArray(prev) ? [...prev, data] : [data]))
	})
	
  
	}catch(error){
	  throw error;
	}
  
	return () => {
	  socket.current.disconnect();
	};
  },[user2])

  
// function which fetch chats when room id clicked on
  const GetRoomData=(chat)=>{
  setRoomname(chat.room_name);
  
  // get room related data;
  dispatch(GetRoomSpecificChats(chat.room_name));
  }


  function SendMessage(){ 
	
	if(!socket.current || !User?.User?.[0])return;
	if(roomdata!==null){
		const lastMessage = roomdata[roomdata.length-1];
		if(lastMessage.sender_id === User.User[0].id){
			setUser2(lastMessage.receiver_id)
		}else{
			setUser2(lastMessage.sender_id);
		}
		
	}
	socket.current.emit("message",({roomName:room_name, user1:User.User[0].id, user2:user2,message:messageInput.current.value,sender_name:senderName}))
	messageInput.current.value = "";
  }
 

	return(
		<>
		<div className=" flex items-center justify-center h-screen">
			 {chats!==null? <div onClick={()=>console.log(roomdata)} className="flex items-normal justify-normal flex-col h-full w-[40%] p-2 gap-3 ">
			 			{/*chat rooms*/}
			 		{[...chats].map((chat,index)=>{
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
			 			 	                    	<button onClick={SendMessage} className="bg-sky-400 px-4 py-1 text-lg rounded-xl shadow-sm shadow-black text-gray-300 font-bold">Send</button>
			 			 	                    </div>
			 			 	               
			 			 	 			 			 	 </div>:null}

</div>
		</>
 )
}


export default AllChats;