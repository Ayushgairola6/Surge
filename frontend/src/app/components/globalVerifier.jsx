'use client'
import {useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux'; 
import {GetAccount,VerifyAccount} from '@/store/AuthSlice'

 const GetAccountVerified = ()=>{

   const dispatch = useDispatch();

    useEffect(()=>{
     dispatch(VerifyAccount());
    //  dispatch(GetAccount());
    },[dispatch])

    return null;
}

export default GetAccountVerified;