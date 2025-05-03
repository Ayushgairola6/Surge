// 'use client'
// // import { useContext } from 'react';
// import { UseStore } from '@/store/store';
// import { useState } from 'react';
// const Topic = () => {

//     // using context of all the functions and state
//     const { topics, currTab,getPosts } = UseStore();


//     return <>
//  <div className="flex flex-wrap items-center justify-center gap-2 border-b px-3 py-2 font-serif">
//   {topics.map((topic, index) => (
//     <ul
//       key={index}
//       onClick={() => getPosts(topic)}

//       className={`cursor-pointer px-4 py-1 border border-gray-400 shadow-sm shadow-black hover:shadow-md text-black font-bold  transition-transform duration-200 ${
//         currTab === topic ? "bg-green-400 rounded-xl scale-105" : "  rounded-xl"
//       } hover:scale-95`}
//     >
//       {topic}
//     </ul>
//   ))}
// </div>


//     </>
// }

// export default Topic;
'use client'
import { UseStore } from '@/store/store';

const Topic = () => {
  // using context for functions and state
  const { topics, currTab, getPosts } = UseStore();

  return (
    <div className="w-full px-4 py-3  bg-black text-white">
      {/* Wrap the buttons in an overflow container to allow horizontal scrolling on smaller screens */}
      <div className="flex gap-3 px-6 items-center overflow-x-auto whitespace-nowrap">

        {topics.map((topic, index) => (
          <button
            key={index}
            onClick={() => getPosts(topic)}
            className={`
              px-4 py-2 font-semibold rounded-full transition-all duration-300 ease-in-out focus:outline-none
              ${currTab === topic
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl transform scale-105"
                : "bg-black text-gray-200 border border-gray-300 hover:border-indigo-500"}
            `}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Topic;
