"use client"
import { useDispatch, useSelector } from "react-redux";
import {useEffect} from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import Login from "./Login/page";
import Signup from "./SignupPage/page";                    
import Topic from "./components/Topic";
import PostCard from "./components/PostCard";
import { UseStore } from "@/store/store"
export default function Home() {
   
   

  return (<>
    
   <Topic/>
    <PostCard/>
    
  </>

  )
}
