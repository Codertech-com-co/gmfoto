"use client";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Typography, Button, IconButton, Tooltip,Breadcrumbs } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const MySwal = withReactContent(Swal);

const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categorias/all`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching categories");
  }
  const data = await response.json();
  return data;
};

const deleteCategory = async (id) => {
  const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error deleting category");
  }
  return response.json();
};

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((category) => category.id !== id));
      MySwal.fire({
        title: "Categoría Eliminada",
        icon: "success",
        toast: true,
        position: "bottom",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: false,
      });
    } catch (error) {
      MySwal.fire({
        title: "Error eliminando categoría",
        icon: "error",
        toast: true,
        position: "bottom",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: false,
      });
      console.error(error);
    }
  };

  return (
    <div>
        <Breadcrumbs>
        <Link href="./" className="opacity-60 hover:text-yellow-900">
          Lista Productos
        </Link>
        <button className="opacity-60" disabled>
          Categoría
        </button>
      </Breadcrumbs>
      <br />
      <div className="flex justify-between items-center mb-5">
        <Typography variant="h3" color="blue-gray">
          Categorías
        </Typography>
        <Link href="./categories/create" className="bg-white shadow text-black p-2 rounded-md">
          Crear Categoría
        </Link>
      </div>
      <div className="p-5 border-dashed border-2 rounded-lg overflow-auto">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="p-4">Id</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Descripción</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(({ id, nombre, descripcion }) => (
              <tr key={id}>
                <td className="p-4 border-b border-blue-gray-50">{id}</td>
                <td className="p-4 border-b border-blue-gray-50">{nombre}</td>
                <td className="p-4 border-b border-blue-gray-50">{descripcion}</td>
                <td className="p-4 border-b border-blue-gray-50">
                  <div className="flex space-x-2">
                    <Tooltip content="Editar">
                      <Link href={`./categories/${id}`}>
                        <IconButton size="sm" className="text-gray-800 bg-white">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Link>
                    </Tooltip>
                    <Tooltip content="Eliminar">
                      <IconButton
                        size="sm"
                        className="bg-white text-red-500"
                        onClick={() => handleDelete(id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
