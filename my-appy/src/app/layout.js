'use client'
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"
import { AuthProvider, UseStore, } from "@/store/store";
import { Provider } from 'react-redux';
import { store } from '@/store/reduxStore';


export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body className="relative">

      <Provider store={store}>
        <AuthProvider>        
          <Navbar/>
          {children}
          <Footer/>
        </AuthProvider>
        </Provider>

      
      </body>
    </html>
  );
}
