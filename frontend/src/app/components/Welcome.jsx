import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import BackgroundEffect from './backgroundEffect';
const Welcome = ({ visible, setVisible }) => {
    const [text, setText] = useState([
        { word: "Breakups", icon: "💔" },
        { word: "Secrets", icon: "🤫" },
        { word: "Confessions", icon: "📝" },
        { word: "Temptations", icon: "😈" },
        { word: "Hookups", icon: "🔥" },
        { word: "Regrets", icon: "😢" },
        { word: "Ghosting", icon: "👻" },
        { word: "Gossips", icon: "🗣️" },
        { word: "Drama", icon: "🎭" },
        { word: "Love", icon: "❤️" },
        { word: "KINDERED", icon: <Image height={30} width={30} className=" rounded-full" src="/images.jpeg" alt="/" /> }
    ]
    );

    const [curr, setCurr] = useState(text[text.length-1]);
    const [index, setIndex] = useState(0);
    const audioRef = useRef()
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => {
                if (prev < text.length - 1) {
                    setCurr(text[prev + 1]);
                    // audioRef.current.play();
                    return prev + 1;
                } else {
                    clearInterval(interval);
                    return prev;
                }
            });
        }, 500);
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (<>
        <div className="h-screen bg-black
            bg-blur flex items-center justify-center relative">
                <BackgroundEffect />
            <span onClick={() => setVisible(false)} className="absolute top-5 right-10 text-white  py-1 px-3 text-sm flex items-center justify-center gap-2 cursor-pointer font-bold ">skip <ArrowRight size={14} /></span>
            <div className="flex items-center justify-center gap-2">
                <h1 className={`${curr.word === "KINDERED" ? "text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700 " : " text-white text-3xl"} transition-all duration-500 font-bold  `}>{curr.word}

                </h1>
                <label>{curr.icon}</label>
            </div>


        </div>
    </>)
}

export default Welcome