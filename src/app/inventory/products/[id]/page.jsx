"use client";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Input from "../../../../components/ui/Input";
import Select2 from "../../../../components/ui/Select2";
import Select from "../../../../components/ui/Select";
import Textarea from "../../../../components/ui/Textarea";
import { Button, Breadcrumbs } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

const MySwal = withReactContent(Swal);

const fetchProductData = async (idProducto) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
    credentials: "include",
  };

  const response = await fetch(
    `${API_BASE_URL}/productos/${idProducto}`,
    requestOptions
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  const result = await response.json();
  return result;
};

const fetchCategories = async () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
    credentials: "include",
  };

  const response = await fetch(
    `${API_BASE_URL}/categorias/all`,
    requestOptions
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  const result = await response.json();
  return result;
};

const updateProductData = async (idProducto, data) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    redirect: "follow",
    credentials: "include",
  };

  const response = await fetch(
    `${API_BASE_URL}/productos/${idProducto}`,
    requestOptions
  );
  const result = await response.json();
  return result;
};

const insertProductData = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    redirect: "follow",
    credentials: "include",
  };

  try {
    const response = await fetch(`${API_BASE_URL}/productos`, requestOptions);
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

// Nueva función para manejar el archivo Excel
const uploadExcel = async (file) => {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(worksheet);

    // Aquí puedes realizar las validaciones necesarias para los datos
    for (const row of json) {
      await insertProductData(row);
    }

    MySwal.fire({
      title: "Datos Importados",
      icon: "success",
      toast: true,
      position: "bottom",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
    });
  } catch (error) {
    MySwal.fire({
      title: "Error al importar datos, " + error.message,
      icon: "error",
      toast: true,
      position: "bottom",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: false,
    });
    // console.error("Error importando datos:", error);
  }
};

export default function ProductForm({ params }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const idProducto = params.id;
  const router = useRouter();

  useEffect(() => {
    const loadProductData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);

        if (idProducto !== "create") {
          const productData = await fetchProductData(idProducto);
          const dataProduct = productData[0];
          // Configura los datos del producto en el formulario
          reset(dataProduct);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadProductData();
  }, [idProducto, reset]);

  const onSubmit = async (data) => {
    console.log("Datos enviados:", data);

    try {
      if (idProducto === "create") {
        await insertProductData(data);
      } else {
        await updateProductData(idProducto, data);
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
        router.push("/inventory");
      }, 500);
    } catch (error) {
      console.log(error.message.indexOf("ya se encuenta"));
      if (error.message && error.message.indexOf("ya se encuentra") > 0) {
        MySwal.fire({
          title: "Error guardando producto, " + error.message,
          html:
            "<a href='/inventory/products/" +
            error.data[0].id +
            "'>Modifiquelo dando clic aqui</a>",
          icon: "error",
          toast: true,
          position: "bottom",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: false,
        });
      } else {
        MySwal.fire({
          title: "Error guardando producto, " + error.message,
          icon: "error",
          toast: true,
          position: "bottom",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: false,
        });
      }

      // console.error("Error guardando producto:", error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadExcel(file);
    }
  };

  return (
    <div>
      <Breadcrumbs>
        <Link href="/inventory" className="opacity-60 hover:text-yellow-900">
          Lista productos
        </Link>
        <button className="opacity-60" disabled>
          Producto
        </button>
      </Breadcrumbs>
      <h2 className="font-bold text-2xl text-black mt-5">
        Información del producto
      </h2>
      <small className="text-black">Complete el siguiente formulario</small>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-dashed rounded-lg border-2 bg-white"
      >
        <Input
          label="Marca"
          name="marca"
          register={register}
          rules={{ required: true }}
          errors={errors}
        />
        <Input
          label="Referencia"
          name="referencia"
          register={register}
          rules={{ required: true }}
          errors={errors}
        />
        <Input
          label="Nombre"
          name="nombre"
          register={register}
          rules={{ required: true }}
          errors={errors}
        />
        <Input
          label="Modelo"
          name="modelo"
          register={register}
          rules={{ required: true }}
          errors={errors}
        />
        <Select2
          label={"Categoría"}
          name={"id_categoria"}
          setValue={setValue}
          register={register}
          rules={{ required: true }}
          options={categories.map((category) => ({
            label: category.nombre,
            value: category.id,
          }))}
        />
        <Input
          label="Ubicación"
          name="ubicacion"
          register={register}
          rules={{ required: false }}
        />
        <Input
          label="Cantidad Disponible"
          name="cantidad_disponible"
          register={register}
          rules={{ required: false }}
          type="number"
          step="1"
          min="0"
        />
        <Input
          label="Cantidad Vendida"
          name="cantidad_vendida"
          register={register}
          rules={{ required: false }}
          type="number"
          step="1"
          min="0"
        />
        <Input
          label="Precio Venta Actual"
          name="precio_venta_actual"
          register={register}
          rules={{ required: false }}
          type="number"
          step="0.01"
        />
        {/* <Textarea
          label={"Descripción"}
          name={"descripcion"}
          register={register}
          rules={{ required: false }}
        /> */}
        <div>
          <small>Descripción</small>
          <Select
            // label={"Descripción"}
            name={"descripcion"}
            register={register}
            rules={{ required: false }}
            options={[
              {
                label: "REPUESTO NIKON",
                value: "REPUESTO NIKON",
              },
              {
                label: "REPUESTO OTRAS MARCAS",
                value: "REPUESTO OTRAS MARCAS",
              },
            ]}
          />
        </div>

        <div className="w-full col-span-1 md:col-span-2 text-right p-5">
          <Link href="../" className="m-2 text-black">
            Cancelar
          </Link>
          <Button type="submit" color="yellow" className="m-2">
            Guardar
          </Button>
        </div>
      </form>
      <div className="mt-5">
        <h2 className="font-bold text-xl">Subir Productos desde Excel</h2>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="mt-2"
        />
      </div>
    </div>
  );
}
