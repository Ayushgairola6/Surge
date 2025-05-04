'use client'
import { io } from 'socket.io-client';
import { useRef, useEffect, useState } from 'react';
import { GetRoomSpecificChats } from '../../store/ChatSlice';
import { useDispatch, useSelector } from 'react-redux';
const Interface = ({ room_name }) => {

	const messageInput = useRef();
	// state variable to store the socket instance
	const dispatch = useDispatch();
	const chats = useSelector(state => state.chat.chatData);
	const [socket, setSocket] = useState(null);

	const [roomName, setRoomname] = useState(null);
	const [username, setUsername] = useState(null);
	const [receipent, setReceipent] = useState(null);
	const [userId, setUserId] = useState(null);
	const token = localStorage.getItem("userdata");

	// fethcing conversation from the room_name
	useEffect(() => {
		dispatch(GetRoomSpecificChats(room_name))
	}, [room_name, dispatch])

	// connecting with the socket instance
	// useEffect(() => {

	// 	const socketIo = io("http://localhost:4000", { auth: { token: token }, withCredentials: true });
	// 	setSocket(socketIo);



	// }, [token])



	return <>
		<div className="bg-gradient-to-br from-purple-300  to-blue-300 h-screen w-screen relative">
			{/*chats*/}
			<div className="h-[90%] text-black font-bold text-md">
				message
			</div>
			{/*input and send button*/}
			<div className=" h-[20%] flex items-center justify-center gap-4 absolute bottom bg-black w-full">
				<input ref={messageInput} className="rounded-xl p-2 font-bold w-[70%]" placeholder="Enter your message here..." type="text" />
				<button className="bg-gradient-to-r from-purple-300 to-green-300 px-4 font-bold rounded-xl border border-black shadow-md shadow-black">
					Send
				</button>
			</div>
		</div>

	</>
}

export default Interface