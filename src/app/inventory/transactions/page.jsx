"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Button,
  Typography,
  Tooltip,
  IconButton,
  Breadcrumbs,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const MySwal = withReactContent(Swal);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetchTransactions = async () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
    credentials: "include",
  };

  const response = await fetch(
    `${API_BASE_URL}/transacciones/all`,
    requestOptions
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  const result = await response.json();
  return result;
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        MySwal.fire({
          title: error.message,
          icon: "error",
          toast: true,
          position: "bottom",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: false,
        });
      }
    };

    loadTransactions();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transacciones/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error deleting transaction");
      }
      setTransactions(
        transactions.filter((transaction) => transaction.id !== id)
      );
      MySwal.fire({
        title: "Transacción eliminada",
        icon: "success",
        toast: true,
        position: "bottom",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: false,
      });
    } catch (error) {
      MySwal.fire({
        title: "Error eliminando transacción",
        icon: "error",
        toast: true,
        position: "bottom",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: false,
      });
      console.error("Error eliminando transacción:", error);
    }
  };

  return (
    <div className="p-6">
      <Breadcrumbs>
        <Link
          href="/inventory/"
          className="opacity-60 hover:text-yellow-900"
        >
          Lista Productos
        </Link>
        <button className="opacity-60" disabled>
          Transacciones
        </button>
      </Breadcrumbs>
      <br />
      <div className="flex items-center justify-between">
        <Typography variant="h3" color="blue-gray">
          Transacciones
        </Typography>
        <Link href="/inventory/transactions/create">
          <Button color="black" >
            Crear Transacción
          </Button>
        </Link>
      </div>
      <div className="mt-6 border-dashed border-2 rounded-lg p-5 bg-white overflow-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                ID
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                Tipo
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                Producto
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                Proveedor
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                Cantidad
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                Cantidad en Stock
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                Número de Referencia
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                Creado Por
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                Fecha de Creación
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="p-4 border-b border-blue-gray-50">
                  {transaction.id}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {transaction.tipo}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {transaction.id_producto}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {transaction.id_proveedor}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {transaction.cantidad}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {transaction.cantidad_stock}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {transaction.numero_referencia}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {transaction.creado_por}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {new Date(transaction.fecha_creacion).toLocaleDateString()}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <div className="flex gap-2">
                    <Link href={`/inventory/transactions/${transaction.id}`}>
                      <Tooltip content="Editar">
                        <IconButton
                          size="sm"
                          className="bg-yellow-500 text-black"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </Link>
                    <Tooltip content="Eliminar">
                      <IconButton
                        size="sm"
                        className="bg-red-500 text-white"
                        onClick={() => handleDelete(transaction.id)}
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
