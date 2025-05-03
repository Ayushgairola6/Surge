'use client'
import "./globals.css";
import React, { useState, useEffect } from 'react'
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Welcome from './components/Welcome';
import GetAccountVerified from './components/globalVerifier'
import { AuthProvider, UseStore, } from "@/store/store";
import { Provider } from 'react-redux';
import { store } from '@/store/reduxStore';


export default function RootLayout({ children }) {

  const [visible, setVisible] = useState(true);
  const [isKinderedUser, setIsKinderedUser] = useState(false);


  useEffect(() => {
    // if user has already used the aop and its value is true
    const isRegularUser = JSON.parse(sessionStorage.getItem("is_kindered_user"));
    if (isRegularUser && isRegularUser === true) {
      // render the childrens
      setVisible(false)
    } else {
      // else set the value in the session storage and wait for the teaser to run fully
      sessionStorage.setItem("is_kindered_user", "true");

      const time = setTimeout(() => {
        setVisible(false);
      }, 5800);

      return () => clearTimeout(time);
    }
  }, [])

  return (
    <html lang="en">
      <body className="relative ">

        <Provider store={store}>
          <AuthProvider>
            <GetAccountVerified />
            {visible === false && <Navbar />}
            {visible === false ? children : <Welcome visible={visible} setVisible={setVisible} />}
          </AuthProvider>
        </Provider>


      </body>
    </html>
  );
}
