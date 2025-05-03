import Image from 'next/image'
import { useState } from 'react';
import axios from 'axios';
const Summarizer = ({ post,showSumarray ,setShowSummary,summary, setSummary}) => {

    const [hovering, setHovering] = useState(false);


    return (<>
        <div
            onClick={() => setShowSummary(true)}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className="text-white fixed bottom-14 right-5 flex items-center justify-center gap-2 border border-indigo-500 rounded-xl z-[9999] transition-all duration-500 p-1 max-w-20 bg-black "
        >
            
            <Image
                className="rounded-full relative cursor-pointer hover:shadow-lg hover:shadow-purple-500"
                src="/images.jpeg"
                alt="Profile"
                height={40}
                width={40}
            />
            <span
                className={`absolute right-full mr-2 bg-black py-1 px-3 rounded-xl text-white transition-all duration-500 ${hovering ? "opacity-100 translate-x-0" : "hidden translate-x-4"}`}
            >
                Summarize with AI
            </span>
        </div>




    </>)
}

export default Summarizer;