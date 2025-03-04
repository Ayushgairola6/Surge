'use client'
import { createContext, useState, useContext } from 'react';

import axios from 'axios'
const AuthContext = createContext();
const topics = ["Tech", "AI", "Politics", "Entertainment", "Horror", "other"]

export const AuthProvider = ({ children }) => {
    // user state
    // login state
    // selected tab state
    const [currTab, setCurrTab] = useState("Tech")
    // posts state
    const [posts, setPosts] = useState(null)
    const [valid ,setIsValid] = useState("no")




    // fetch posts on desired tab click
    function getPosts(topic) {
        setCurrTab(topic)
        axios.get(`http://localhost:8080/api/feed/posts/${topic}`).then(res => {
            setPosts(res.data);
        }).catch(error => {
            alert(error);
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