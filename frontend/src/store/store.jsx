'use client'
import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios'
import { io } from 'socket.io-client';
const AuthContext = createContext();
const topics = ["Crush Confessions", "Green and Red flags", "First Date stories", "Gossip zone", "Match Me Up", "Breakup Corner", "Mental Check-In"]

export const AuthProvider = ({ children }) => {
    // user state
    // login state
    // selected tab state
    const [currTab, setCurrTab] = useState("Crush Confessions")
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    // posts state
    const [posts, setPosts] = useState(null)
    const [valid, setIsValid] = useState("no")
    const socket = useRef();
    const [like_notification, setLike_notification] = useState(null);
    const [message_notification, setMessage_notification] = useState(null);
    // connnecting to the socket
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (!token || isLoggedIn === false) return;
        socket.current = io("https://surge-oyqw.onrender.com", {
            auth: { token },
            withCredentials: true
        });
        socket.current.on("connect", () => {
            console.log("Socket from global context file has been connected")
        });
        socket.current.on("like_received", (data) => {
            setLike_notification(data.message);
        })

        socket.current.on("message_notify", (data) => {
            setMessage_notification(`You have got a new message from ${data.by}`);
        })
    }, [isLoggedIn])

    // fetch posts on desired tab click
    async function getPosts(topic) {
        const token = localStorage.getItem("auth_token");
        setCurrTab(topic)

        try {
            const response = await axios.get(`https://surge-oyqw.onrender.com/api/feed/posts/${topic}`, {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
        } catch (error) {
            // console.log(error);
            throw new Error(error);
        }

    }



    // function invocation

    return (
        <AuthContext.Provider
            value={{ currTab, topics, setPosts, posts, getPosts, socket, like_notification, setLike_notification ,message_notification, setMessage_notification}}>
            {children}
        </AuthContext.Provider>

    )

}

export const UseStore = () => useContext(AuthContext);