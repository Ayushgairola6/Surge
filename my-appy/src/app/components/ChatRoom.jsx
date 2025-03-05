'use client'
import {io} from 'socket.io-client';
import {useRef,useEffect,useState} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { GetAccount } from '@/store/AuthSlice';
const ChatRoom = ({id})=>{
 
	const dispatch = useDispatch();
	useEffect(()=>{
		dispatch(GetAccount())
	},[dispatch])

	const user = useSelector(state=>state.auth.user);
const messageInput = useRef();
// state variable to store the socket instance
const socket = useRef(null)
const [messages,setMessage] =useState([]);
const [user1,setUser1]=useState(null);
const [user2,setUser2]=useState(null);
const [roomName,setRoomName] = useState(null)
 const token = localStorage.getItem("userdata");

// connecting with the socket instance
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
	  console.log(socket.current);
	 // emit a connection event 
	 socket.current.on("connection",()=>{
	   console.log("Socket connection has been established");
	 })
  
	 // emit a join chat event with user 2 data
	 if(id){socket.current.emit("joinChat", { selectedUser:id })};
	 
	 socket.current.on("roomJoined",(data)=>{
	  setRoomName(data.roomName);
	  setUser1(user.User[0].id);
	  setUser2(id);
	  
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




	return <>
		<div  className="bg-gradient-to-br from-purple-300  to-blue-300 h-screen w-screen relative">
			{/*chats*/}
			<div onClick={()=>console.log(messages)}  className="h-[90%] text-black font-bold text-md">
				{messages.map((message,index)=>{
				return	<div className={`${message.sender_id===user1?"text-left":"text-right"}`} key={index}>
				<ul >{message.message}</ul>					
				</div>
				})}
			</div>
		{/*input and send button*/}
			<div className=" h-[20%] flex items-center justify-center gap-4 absolute bottom bg-black w-full">
				<input   ref={messageInput} className="rounded-xl p-2 font-bold w-[70%]" placeholder="Enter your message here..." type="text"/>
				<button  onClick={()=>{
					socket.current.emit("message",({roomName:roomName, user1:user1, user2:user2,message:messageInput.current.value}));
					messageInput.current.value="";
				}} className="bg-gradient-to-r from-purple-300 to-green-300 px-4 font-bold rounded-xl border border-black shadow-md shadow-black">
				Send
				</button>
			</div>
		</div>

	</>
}

export default ChatRoom