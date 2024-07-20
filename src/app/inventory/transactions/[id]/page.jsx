"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useForm } from "react-hook-form";
import { Button, Typography,Breadcrumbs } from "@material-tailwind/react";
import Input from "../../../../components/ui/Input";
import Select from "../../../../components/ui/Select2";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MySwal = withReactContent(Swal);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetchTransaction = async (id) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
    credentials: "include",
  };

  const response = await fetch(`${API_BASE_URL}/transacciones/${id}`, requestOptions);
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  const result = await response.json();
  return result;
};

const fetchProducts = async () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
    credentials: "include",
  };

  const response = await fetch(`${API_BASE_URL}/productos/all`, requestOptions);
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  const result = await response.json();
  return result;
};

const fetchProviders = async () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
    credentials: "include",
  };

  const response = await fetch(`${API_BASE_URL}/proveedores/all`, requestOptions);
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  const result = await response.json();
  return result;
};

const updateTransaction = async (id, data) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    redirect: "follow",
    credentials: "include",
  };

  const response = await fetch(`${API_BASE_URL}/transacciones/${id}`, requestOptions);
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return await response.json();
};

const insertTransaction = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    redirect: "follow",
    credentials: "include",
  };

  const response = await fetch(`${API_BASE_URL}/transacciones`, requestOptions);
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return await response.json();
};

export default function TransactionForm({ params }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [products, setProducts] = useState([]);
  const [providers, setProviders] = useState([]);
  const [transaction, setTransaction] = useState(null);
  const idTransaction = params.id; // Asegúrate de que params.id esté correctamente definido
  const router = useRouter();

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [productsData, providersData] = await Promise.all([fetchProducts(), fetchProviders()]);
        setProducts(productsData);
        setProviders(providersData);

        if (idTransaction !== "create") {
          const transactionData = await fetchTransaction(idTransaction);
          const transactionItem = transactionData[0]; // Obtener el primer elemento de la lista
          setTransaction(transactionItem);
          // Configura los datos de la transacción en el formulario
          reset({
            id_producto: transactionItem.id_producto,
            id_proveedor: transactionItem.id_proveedor,
            cantidad: transactionItem.cantidad,
            cantidad_stock: transactionItem.cantidad_stock,
            numero_referencia: transactionItem.numero_referencia,
            creado_por: transactionItem.creado_por,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        MySwal.fire({
          title: "Error cargando datos",
          icon: "error",
          toast: true,
          position: "bottom",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: false,
        });
      }
    };

    loadOptions();
  }, [idTransaction, reset]);

  const onSubmit = async (data) => {
    try {
      if (idTransaction === "create") {
        await insertTransaction(data);
      } else {
        await updateTransaction(idTransaction, data);
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

      router.push('/inventory/transactions');
    } catch (error) {
      MySwal.fire({
        title: "Error guardando datos",
        icon: "error",
        toast: true,
        position: "bottom",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: false,
      });
      console.error("Error guardando datos:", error);
    }
  };

  return (
    <div className="p-6">
          <Breadcrumbs>
                <Link href="/inventory/proveedores" className="opacity-60 hover:text-yellow-900">
                    Lista transacciones
                </Link>
                <button className="opacity-60" disabled>
                    Transaccion
                </button>
            </Breadcrumbs>
      <Typography variant="h3" color="blue-gray">
        {idTransaction === "create" ? "Crear Transacción de Inventario" : "Editar Transacción"}
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 p-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-dashed rounded-lg border-2 bg-white"
      >
        <Select
          label="Producto"
          name="id_producto"
          setValue={setValue}
          register={register}
          rules={{ required: true }}
          options={products.map(product => ({
            label: `${product.marca} - ${product.referencia}`, // Ajusta según los datos disponibles
            value: product.id
          }))}
        />
        <Select
          label="Proveedor"
          name="id_proveedor"
          setValue={setValue}
          register={register}
          rules={{ required: true }}
          options={providers.map(provider => ({
            label: provider.nombre_empresa, // Ajusta según los datos disponibles
            value: provider.id
          }))}
        />
        <Input
          label="Cantidad"
          name="cantidad"
          register={register}
          rules={{ required: true }}
          type="number"
          step="1"
        />
        <Input
          label="Cantidad en Stock"
          name="cantidad_stock"
          register={register}
          rules={{ required: true }}
          type="number"
          step="1"
        />
        <Input
          label="Número de Referencia"
          name="numero_referencia"
          register={register}
          rules={{ required: true }}
        />
        <Input
          label="Creador"
          name="creado_por"
          register={register}
          rules={{ required: true }}
        />
        <div className="w-full col-span-1 md:col-span-2 text-right p-5">
          <Button type="submit" color="yellow" className="m-2">
            {idTransaction === "create" ? "Crear Transacción" : "Actualizar Transacción"}
          </Button>
        </div>
      </form>
    </div>
  );
}
