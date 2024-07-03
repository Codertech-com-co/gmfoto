"use client";
import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [auth, setAuth] = useState(false);
  const router = useRouter()

  const date = new Date();
  const year = date.getFullYear();

  const metadata = {
    title: "CRM GMFOTO",
    description:
      "Reparación y mantenimiento de cámaras Nikon: calidad y confianza",
  };

  
 

  const requestOptions = {
    method: "GET",
    redirect: "follow",
    credentials: 'include'
  };

  fetch("http://127.0.0.1:3001/auth/validate", requestOptions)
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
    
      return response.json();

    })
    .then((result) => {
      
      setAuth(true)
    })
    .catch((error) => {
      setAuth(false)
      router.push('login')

    });

  return (
    <html lang="es">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={`${inter.className} dark:bg-gray-900`}>
        {auth ? <Navbar /> : ""}

        <div className="h-full w-full md:w-[75%] m-auto mt-5 shadow-none p-5">
          {children}
        </div>

        <footer className="text-center items-end text-black">
          <small className="dark:text-white">CoderTech © {year}</small>
        </footer>
      </body>
    </html>
  );
}
