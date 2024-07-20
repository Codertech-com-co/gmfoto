// pages/proveedores/index.js

"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { Typography, Button, Tooltip, IconButton,Breadcrumbs } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function Proveedores() {
    const [proveedores, setProveedores] = useState([]);

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/proveedores/all`, {
                    method: "GET",
                    credentials: "include"
                });

                if (response.ok) {
                    const data = await response.json();
                    setProveedores(data);
                } else {
                    console.error("Error al obtener proveedores:", response.statusText);
                }
            } catch (error) {
                console.error("Error al obtener proveedores:", error);
            }
        };

        fetchProveedores();
    }, []);

    const handleDelete = async (id) => {
        try {
            const result = await MySwal.fire({
                title: "¿Estás seguro?",
                text: "No podrás revertir esto",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (result.isConfirmed) {
                const response = await fetch(`${API_BASE_URL}/proveedores/${id}`, {
                    method: "DELETE",
                    credentials: "include"
                });

                if (response.ok) {
                    setProveedores(proveedores.filter(proveedor => proveedor.id !== id));
                    MySwal.fire("Eliminado", "El proveedor ha sido eliminado.", "success");
                } else {
                    console.error("Error al eliminar proveedor:", response.statusText);
                    MySwal.fire("Error", "No se pudo eliminar el proveedor.", "error");
                }
            }
        } catch (error) {
            console.error("Error al eliminar proveedor:", error);
            MySwal.fire("Error", "No se pudo eliminar el proveedor.", "error");
        }
    };

    return (
        <div>
              <Breadcrumbs>
                <Link href="/inventory/" className="opacity-60 hover:text-yellow-900">
                    Lista Productos
                </Link>
                <button className="opacity-60" disabled>
                    Proveedores
                </button>
            </Breadcrumbs>
            <br />
            <div className="grid grid-cols-2 gap-4">
                <Typography variant="h3" color="blue-gray">
                    Proveedores
                </Typography>
                <div className="flex gap-4 col-span-2 md:col-span-1 w-full place-content-end">
                    <Link href={'./proveedores/create'} className="bg-yellow-500 text-black p-2 rounded">Crear Proveedor</Link>
                </div>
            </div>
            <hr className="mt-5 mb-5" />
            <div className="p-5 border-dashed border-2 rounded-lg overflow-auto">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            <th className="p-4">Nombre Empresa</th>
                            <th className="p-4">Teléfono</th>
                            <th className="p-4">Dirección</th>
                            <th className="p-4">Número Documento</th>
                            <th className="p-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proveedores.map(({ id, nombre_empresa, telefono, direccion, numero_documento }) => (
                            <tr key={id}>
                                <td className="p-4 border-b border-blue-gray-50">{nombre_empresa}</td>
                                <td className="p-4 border-b border-blue-gray-50">{telefono}</td>
                                <td className="p-4 border-b border-blue-gray-50">{direccion}</td>
                                <td className="p-4 border-b border-blue-gray-50">{numero_documento}</td>
                                <td className="p-4 border-b border-blue-gray-50 flex gap-2">
                                    <Link href={`./proveedores/${id}`}>
                                        <Tooltip content="Editar">
                                            <IconButton size="sm" className="bg-yellow-500 text-black">
                                                <PencilIcon className="h-4 w-4" />
                                            </IconButton>
                                        </Tooltip>
                                    </Link>
                                    <Tooltip content="Eliminar">
                                        <IconButton size="sm" className="bg-red-500 text-white" onClick={() => handleDelete(id)}>
                                            <TrashIcon className="h-4 w-4" />
                                        </IconButton>
                                    </Tooltip>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
