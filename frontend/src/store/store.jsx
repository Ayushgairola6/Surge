'use client'
import { createContext, useState, useContext } from 'react';

import axios from 'axios'
const AuthContext = createContext();
const topics = ["Crush Confessions", "Green and Red flags", "First Date stories", "Gossip zone", "Match Me Up", "Breakup Corner","Mental Check-In"]

export const AuthProvider = ({ children }) => {
    // user state
    // login state
    // selected tab state
    const [currTab, setCurrTab] = useState(topics[0])
    // posts state
    const [posts, setPosts] = useState(null)
    const [valid ,setIsValid] = useState("no")




    // fetch posts on desired tab click
    function getPosts(topic) {
        setCurrTab(topic)
        axios.get(`https://surge-oyqw.onrender.com/api/feed/posts/${topic}`,{withCredentials:true}).then(res => {
            setPosts(res.data);
        }).catch(error => {
        })

    }

   

    // function invocation

    return (
        <AuthContext.Provider
            value={{   currTab, topics, setPosts, posts, getPosts }}>
            {children}
        </AuthContext.Provider>
    
    )

}

export const UseStore = () => useContext(AuthContext);