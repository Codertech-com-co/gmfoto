import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CRM GMFOTO",
  description: "Reparación y mantenimiento de cámaras Nikon: calidad y confianza",
};

export default function RootLayout({ children }) {

  const date = new Date()
  const year = date.getFullYear()

  return (
    <html lang="es">
      <body className={`${inter.className} dark:bg-gray-900`}>
        <Navbar></Navbar>

        <div className="h-full w-full md:w-[75%] m-auto mt-5 shadow-none p-5">
          {children}
        </div>

        <footer className="text-center items-end text-black">
          <small>CoderTech © {year}</small>
        </footer>

      </body>
    </html>
  );
}
