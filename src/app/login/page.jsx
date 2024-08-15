"use client";
const API_BASE_URL  = process.env.NEXT_PUBLIC_API_BASE_URL;
import { useState } from "react";
import Image from "next/image";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [errorApi, setErrorApi] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(data);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
      credentials: 'include'
    };

    fetch(API_BASE_URL+"/auth/login", requestOptions)
      .then(async (response) => {
        if (!response.ok) {
          throw await response.json();
        }
        router.push('/orders')
        return response.json();
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
        setErrorApi(error.message);
      });
  };
  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:block ">
        <img
          src="https://images.unsplash.com/photo-1614108831136-a6bba175a08e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YyVDMyVBMW1hcmElMjBuaWtvbnxlbnwwfHwwfHx8MA%3D%3D"
          alt="Camera background"
          className="h-full w-full object-cover "
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <CameraIcon className="h-12 w-12" />
          <h1 className="text-3xl font-bold">CRM GMFOTO</h1>
          <p className="max-w-md text-lg">
            Reparación y mantenimiento de cámaras Nikon: calidad y confianza
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-white px-4 py-12 dark:bg-gray-950 dark:bg-black">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="flex items-center justify-center">
            <CameraIcon className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold ">GMFOTO</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Iniciar sesión</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Ingresa tus credenciales para acceder a tu cuenta.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label={"Correo Electronico"}
                register={register}
                name={"email"}
                rules={{ required: true }}
                id="email"
                type="text"
                autocomplete="off"
                placeholder="Ingresa tu correo"
              />
              {errors.username?.type === "required" && (
                <p role="alert" className="text-red-400 text-sm">
                  Usuario es requerido
                </p>
              )}
            </div>
            <div>
              <Input
                label={"Contraseña"}
                register={register}
                name={"password"}
                rules={{ required: true }}
                id="password"
                type="password"
                autocomplete="off"
                placeholder="Ingresa tu contraseña"
              />
              {errors.password?.type === "required" && (
                <p role="alert" className="text-red-400 text-sm">
                  Contraseña es requerida
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" className="w-full">
                Iniciar sesión
              </button>
            </div>

            <div className="text-center">
              <b className="text-red-700">{errorApi}</b>
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <Link
                href="/recoverPassword"
                className="font-medium hover:underline"
                prefetch={false}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function CameraIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
