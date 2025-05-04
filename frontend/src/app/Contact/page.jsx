"use client"
import axios from 'axios';
import React, { useRef, useState } from 'react'

const ContactPage = () => {

    const InputRef = useRef();
    const [status, setStatus] = useState("idle");

    async function handleFeedbac(e) {
        e.preventDefault();
        if (!InputRef.current || InputRef.current.value === "") return;
        const token = localStorage.getItem("auth_token");
        try {
            setStatus("pending");
            const response = await axios.post("https://surge-oyqw.onrender.com/api/feedback", { feedback: InputRef.current.value }, {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (response.data.message === "Done") {
                setStatus("Done");
                console.log(response.data);
              
            }
            
        } catch (error) {
            setStatus("idle");
        }
        InputRef.current.value = ""
    }


    return (<>
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md  rounded-2xl shadow-lg shadow-indigo-800 p-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 text-center mb-2">
                    Want us to add or change something?
                </h1>
                <h2 className="text-xl text-gray-400  text-center mb-8">
                    Contact Us!
                </h2>
                <form onSubmit={(e) => handleFeedbac(e)} className="flex flex-col gap-6">
                    <label htmlFor="message" className="text-lg font-mono font-medium text-white">
                        Your Message
                    </label>
                    <textarea
                        ref={InputRef}
                        id="message"
                        name="feedback"
                        placeholder="Type your message..."
                        className="p-3 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none h-32 transition duration-300 rounded-xl"
                    ></textarea>
                    {status === "pending" ? (<div className='flex items-center justify-center'>
                        <div className='border-t-4 border-red-500 animate-spin h-10 w-10 rounded-full'>

                        </div>

                    </div>) : <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-700 to-purple-800 text-white py-3 rounded-full font-semibold transform transition hover:scale-105 shadow-sm shadow-black"
                    >
                        SEND
                    </button>}
                </form>
            </div>
        </div>
    </>)
}

export default ContactPage