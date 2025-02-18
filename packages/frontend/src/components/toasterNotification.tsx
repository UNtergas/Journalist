'use client';

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

interface ToastProviderProps {
    children: React.ReactNode;
}

export function ToasterProvider({children}: ToastProviderProps) {
    return(
        <>
            {children}
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                newestOnTop={true}
                style={{zIndex: 9999}}
            />
        </>
    )
}