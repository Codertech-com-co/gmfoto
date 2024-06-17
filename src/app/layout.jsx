import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CRM GMFOTO",
  description: "Reparación y mantenimiento de cámaras Nikon: calidad y confianza",
};

export default function RootLayout({ children }) {

  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar></Navbar>

        <div className="h-full w-full md:w-[75%] m-auto mt-5 shadow-none p-5">
          {children}
        </div>

        <footer className="text-center items-end">
          <small>CoderTech © 2024</small>
        </footer>

      </body>
    </html>
  );
}
