"use client"
import axios from 'axios';
import React, { useRef } from 'react'

const ContactPage = () => {

    const InputRef = useRef();

    async function handleFeedbac(e) {
        e.preventDefault();
        if (!InputRef.current || InputRef.current.value === "") return;
        const token = localStorage.getItem("auth_token");
        try {
            const response = await axios.post("http://localhost:8080/send/feedback", { data: InputRef.current.value }, {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response.data);
        } catch (error) {
            console.log(error);
            throw new Error("Error while sending feedback!")
        }

    }


    return (<>
        <div className="min-h-screen bg-gradient-to-br from-teal-300 via-purple-300 to-lime-300 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
                    Want to share something?
                </h1>
                <h2 className="text-xl text-gray-600 underline text-center mb-8">
                    Contact Us!
                </h2>
                <form onSubmit={(e) => handleFeedbac(e)} className="flex flex-col gap-6">
                    <label htmlFor="message" className="text-lg font-mono font-medium text-gray-700">
                        Your Message
                    </label>
                    <textarea
                        ref={InputRef}
                        id="message"
                        name="feedback"
                        placeholder="Type your message..."
                        className="p-3 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none h-32 transition duration-300 rounded-xl"
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-lime-500 to-pink-500 text-white py-3 rounded-full font-semibold transform transition hover:scale-105 shadow-sm shadow-black"
                    >
                        SEND
                    </button>
                </form>
            </div>
        </div>
    </>)
}

export default ContactPage