// pages/proveedores/create.js
// pages/proveedores/edit/[id].js

"use client";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Input from "../../../../components/ui/Input";
import { Button } from "@material-tailwind/react";
import { Breadcrumbs } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";

const MySwal = withReactContent(Swal);

const fetchProveedorData = async (idProveedor) => {
    const requestOptions = {
        method: "GET",
        redirect: "follow",
        credentials: "include",
    };

    const response = await fetch(`${API_BASE_URL}/proveedores/${idProveedor}`, requestOptions);
    if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
    }

    const result = await response.json();
    return result;
};

const updateProveedorData = async (idProveedor, data) => {
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        redirect: "follow",
        credentials: "include",
    };

    const response = await fetch(`${API_BASE_URL}/proveedores/${idProveedor}`, requestOptions);
    const result = await response.json();
    return result;
};

const insertProveedorData = async (data) => {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        redirect: "follow",
        credentials: "include",
    };

    const response = await fetch(`${API_BASE_URL}/proveedores`, requestOptions);
    const result = await response.json();
    return result;
};

export default function ProveedorForm() {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const params = useParams();
    const idProveedor = params.id;
    const router = useRouter();

    useEffect(() => {
        const loadProveedorData = async () => {
            try {
                if (idProveedor && idProveedor !== "create") {
                    const proveedorData = await fetchProveedorData(idProveedor);
                    reset(proveedorData[0]);
                }
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };

        loadProveedorData();
    }, [idProveedor, reset]);

    const onSubmit = async (data) => {
        try {
            if (idProveedor === "create") {
                await insertProveedorData(data);
            } else {
                await updateProveedorData(idProveedor, data);
            }

            MySwal.fire({
                title: "Datos Guardados",
                icon: "success",
                toast: true,
                position: "bottom",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: false,
            });

            setTimeout(() => {
                router.push('/inventory/proveedores');
            }, 500);
        } catch (error) {
            MySwal.fire({
                title: "Error guardando proveedor",
                icon: "error",
                toast: true,
                position: "bottom",
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: false,
            });
            console.error("Error guardando proveedor:", error);
        }
    };

    return (
        <div>
            <Breadcrumbs>
                <Link href="/inventory/proveedores" className="opacity-60 hover:text-yellow-900">
                    Lista proveedores
                </Link>
                <button className="opacity-60" disabled>
                    Proveedor
                </button>
            </Breadcrumbs>
            <h2 className="font-bold text-2xl text-black mt-5">
                Información del proveedor
            </h2>
            <small className=" text-black">Complete el siguiente formulario</small>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-dashed rounded-lg border-2 bg-white">
                <Input
                    label="Nombre Empresa"
                    name="nombre_empresa"
                    register={register}
                    rules={{ required: true }}
                    errors={errors}
                />
                <Input
                    label="Número Documento"
                    name="numero_documento"
                    register={register}
                    rules={{ required: true }}
                    errors={errors}
                />
                <Input
                    label="Teléfono"
                    name="telefono"
                    register={register}
                    rules={{ required: true }}
                    errors={errors}
                />
                <Input
                    label="Dirección"
                    name="direccion"
                    register={register}
                    rules={{ required: false }}
                    errors={errors}
                />
                <div className="w-full col-span-1 md:col-span-2 text-right p-5">
                    <Link href="../proveedores" className="m-2 text-black">
                        Cancelar
                    </Link>
                    <Button type="submit" color="yellow" className="m-2">
                        Guardar
                    </Button>
                </div>
            </form>
        </div>
    );
}
