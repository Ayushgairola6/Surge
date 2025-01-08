'use client'
// import { useContext } from 'react';
import { UseStore } from '@/store/store';
import { useState } from 'react';
const Topic = () => {

    // using context of all the functions and state
    const { topics, currTab,getPosts } = UseStore();


    return <>
        <div className="flex items-center justify-evenly p-2 font-serif  ">
            {topics.map((topic, index) => {
                return <ul key={index}  onClick={()=>getPosts(topic)} className={`cursor-pointer     ${currTab === topic ? "bg-green-400 rounded-xl px-2 border border-black text-black shadow-md  shadow-black font-bold hover:scale-90" : null}`}>{topic}</ul>
            })}
        </div>
    </>
}

export default Topic;