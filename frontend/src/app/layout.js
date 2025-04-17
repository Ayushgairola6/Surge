'use client'
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"
import GetAccountVerified from './components/globalVerifier'
import { AuthProvider, UseStore, } from "@/store/store";
import { Provider } from 'react-redux';
import { store } from '@/store/reduxStore';
import React,{ useEffect } from "react";

export default function RootLayout({ children }) {
 
  // useEffect

  return (
    <html lang="en">
      <body className="relative">

      <Provider store={store}>
        <AuthProvider>        
        <GetAccountVerified/>

          <Navbar/>
          {children}
          {/* <Footer/> */}
        </AuthProvider>
        </Provider>

      
      </body>
    </html>
  );
}
