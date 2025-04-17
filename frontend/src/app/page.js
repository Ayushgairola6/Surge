"use client"
import { useDispatch, useSelector } from "react-redux";
import {useEffect} from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import Login from "./Login/page";
import Signup from "./SignupPage/page";                    
import Topic from "./components/Topic";
import PostCard from "./components/PostCard";
import { GetAccount } from "@/store/AuthSlice";
export default function Home() {

  // react-redux tools
   const isLoggedIn = useSelector(state=>state.auth.isLoggedIn)
   const dispatch = useDispatch();
  //  if user successfully logs in get his account details
   useEffect(()=>{
     if(isLoggedIn===true){
      dispatch(GetAccount());
     }
  },[isLoggedIn])
   

  return (<>
    
   <Topic/>
    <PostCard/>
    
  </>

  )
}
