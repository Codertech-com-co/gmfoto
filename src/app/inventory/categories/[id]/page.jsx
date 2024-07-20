"use client";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Input from "../../../../components/ui/Input";
import Textarea from "../../../../components/ui/Textarea";
import { Button, Breadcrumbs } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

const MySwal = withReactContent(Swal);

const fetchCategoryData = async (idCategoria) => {
  const response = await fetch(`${API_BASE_URL}/categorias/${idCategoria}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching category");
  }
  const data = await response.json();
  return data;
};

const updateCategoryData = async (idCategoria, data) => {
  const response = await fetch(`${API_BASE_URL}/categorias/${idCategoria}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error updating category");
  }
  return response.json();
};

const insertCategoryData = async (data) => {
  const response = await fetch(`${API_BASE_URL}/categorias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error creating category");
  }
  return response.json();
};

export default function CategoryForm({ params }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const idCategoria = params.id;
  const router = useRouter();

  useEffect(() => {
    const loadCategoryData = async () => {
      if (idCategoria !== "create") {
        try {
          const categoryData = await fetchCategoryData(idCategoria);
          reset(categoryData[0]);
        } catch (error) {
          console.error(error);
        }
      }
    };

    loadCategoryData();
  }, [idCategoria, reset]);

  const onSubmit = async (data) => {
    try {
      if (idCategoria === "create") {
        await insertCategoryData(data);
      } else {
        await updateCategoryData(idCategoria, data);
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
        router.push('/inventory/categories');
      }, 500);
    } catch (error) {
      MySwal.fire({
        title: "Error guardando categoría",
        icon: "error",
        toast: true,
        position: "bottom",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: false,
      });
      console.error("Error guardando categoría:", error);
    }
  };

  return (
    <div>
      <Breadcrumbs>
        <Link href="/categories" className="opacity-60 hover:text-yellow-900">
          Lista categorías
        </Link>
        <button className="opacity-60" disabled>
          Categoría
        </button>
      </Breadcrumbs>
      <h2 className="font-bold text-2xl text-black mt-5">
        Información de la categoría
      </h2>
      <small className="text-black">Complete el siguiente formulario</small>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-dashed rounded-lg border-2 bg-white"
      >
        <Input
          label="Nombre"
          name="nombre"
          register={register}
          rules={{ required: true }}
          errors={errors}
        />
        <Textarea
          label="Descripción"
          name="descripcion"
          register={register}
          rules={{ required: false }}
        />
        <div className="w-full col-span-1 md:col-span-2 text-right p-5">
          <Link href="../categories" className="m-2 text-black">
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
