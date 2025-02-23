'use client'
import {io} from 'socket.io-client';
import {useRef,useEffect,useState} from 'react';

const ChatRoom = ({id})=>{

const messageInput = useRef();
// state variable to store the socket instance
const [socket ,setSocket] = useState(null);
const [messages,setMessage] =useState([]);
const [roomName,setRoomname] = useState(null);
const [username, setUsername] = useState(null);
const [receipent,setReceipent] = useState(null);
const [userId,setUserId] =useState(null);
 const token = localStorage.getItem("userdata");

// connecting with the socket instance
useEffect(()=>{

 const socketIo = io("http://localhost:4000", { auth: { token: token } });
  setSocket(socketIo);

// Join a room (example)
 socketIo.emit("joinRoom", { user2Id: id });
// listening to events
socketIo.on("roomJoined",(data)=>{
	setRoomname(data.roomName);
	setUsername(data.username);
	setUserId(data.userId);
	setReceipent(data.user2Id)

})
socketIo.on("message",(message)=>{
	setMessage((prev)=>[...prev,message]);
	console.log(message,"message")
})

socketIo.on('error', (errorMessage) => { alert(errorMessage) });
return ()=>{
	socketIo.disconnect();
}

},[id, token])



	return <>
		<div onClick={()=>console.log(messages)} className="bg-gradient-to-br from-purple-300  to-blue-300 h-screen w-screen relative">
			{/*chats*/}
			<div  className="h-[90%] text-black font-bold text-md">
				{messages.map((text,index)=>{
				return	<div key={index}>
				<span>{text.username}</span>
				<ul >{text.message}</ul>					
				</div>
				})}
			</div>
		{/*input and send button*/}
			<div className=" h-[20%] flex items-center justify-center gap-4 absolute bottom bg-black w-full">
				<input   ref={messageInput} className="rounded-xl p-2 font-bold w-[70%]" placeholder="Enter your message here..." type="text"/>
				<button  onClick={()=>{
					if (socket) {
					 socket.emit("message", {roomName: roomName,
						 message: messageInput.current.value,
						 user:username,id:userId ,user2Id:receipent}); 
						messageInput.current.value = ""; }
				}} className="bg-gradient-to-r from-purple-300 to-green-300 px-4 font-bold rounded-xl border border-black shadow-md shadow-black">
				Send
				</button>
			</div>
		</div>

	</>
}

export default ChatRoom