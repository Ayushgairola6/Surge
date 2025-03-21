'use client'
// import { useContext } from 'react';
import { UseStore } from '@/store/store';
import { useState } from 'react';
const Topic = () => {

    // using context of all the functions and state
    const { topics, currTab,getPosts } = UseStore();


    return <>
 <div className="flex flex-wrap items-center justify-center gap-2 border-b px-3 py-2 font-serif">
  {topics.map((topic, index) => (
    <ul
      key={index}
      onClick={() => getPosts(topic)}
      className={`cursor-pointer px-2 rounded-xl py-1 text-black font-bold shadow-md transition-transform duration-200 ${
        currTab === topic ? "bg-green-400 scale-105" : "bg-gray-200"
      } rounded-md hover:scale-95`}
    >
      {topic}
    </ul>
  ))}
</div>


    </>
}

export default Topic;