"use client";
const API_BASE_URL  = process.env.NEXT_PUBLIC_API_BASE_URL;
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select2";
import Textarea from "../../../components/ui/Textarea";
import { Button } from "@material-tailwind/react";
import { Breadcrumbs } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import {
  PencilIcon,
  UserPlusIcon,
  DocumentIcon,
} from "@heroicons/react/24/solid";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  Card,
  CardHeader,
  
  Typography,
  
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";

const MySwal = withReactContent(Swal);

const fetchOrdersData = async (idEquipo) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
    credentials: "include",
  };

  try{
     const response = await fetch(
    `${API_BASE_URL}/orders/equipo/${idEquipo}`,
    requestOptions
  );
  // Verificar el estado de la respuesta
  if (!response.ok) {
    // Obtener el mensaje de error del cuerpo de la respuesta
    const errorData = await response.json();
    throw errorData;
  }

  // Convertir la respuesta a JSON
  const result = await response.json();
  return result;
  }
  catch (error) {
    // Manejar errores de red o de la API
    // console.error('Error actualizando los datos del cliente:', error);
    throw error;
  }

};



const fetchClientData = async (idEquipo) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const response = await fetch(
    `${API_BASE_URL}/equipos/${idEquipo}`,
    requestOptions
  );
  const result = await response.json();
  return result[0];
};

const updateClientData = async (idEquipo, data) => {
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
    `${API_BASE_URL}/equipos/${idEquipo}`,
    requestOptions
  );
  const result = await response.json();
  return result;
};
const insertClientData = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    redirect: "follow",
    credentials: "include",
  };

  const response = await fetch(
    `${API_BASE_URL}/equipos/`,
    requestOptions
  );
  const result = await response.json();
  return result;
};

export default function ClientForm({ params }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [client, setClient] = useState(null);
  const [marca, setMarca] = useState(null);
  const [dataOrders, setDataOrders] = useState([]);
  const idEquipo = params.id; // Reemplaza esto con la forma en que obtienes el ID del cliente
  const router = useRouter();

  const TABLE_HEAD = [
    "Consecutivo",
    "Etapa",
    "Tipo",
    "Cliente",
    "Fecha Creacion",
    "Creado por",
    "",
  ];
  
const ROWS_PER_PAGE = 10;

  useEffect(() => {
    const loadClientData = async () => {
      const clientData = await fetchClientData(idEquipo);
       // Resetear el formulario con los datos del cliente
       reset(clientData);
      
      setClient(clientData);
      setMarca(clientData.marca)

      const orders = await fetchOrdersData(idEquipo)
      setDataOrders(orders)
      
      
     
    };

    loadClientData();
  }, [idEquipo,reset]);
  

  const onSubmit = async (data) => {
    data = {
      ...data,
      activo:'SI'
    }

    try {
      if (idEquipo == "create") {
        const insert = await insertClientData(data);
      } else {
        const updatedClient = await updateClientData(idEquipo, data);
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
        router.push('/equipos');
      }, 500)

      // console.log("Cliente actualizado:", updatedClient);
    } catch (error) {
      MySwal.fire({
        title: "Error actualizando cliente",
        icon: "error",
        toast: true,
        position: "bottom",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: false,
      });
      // console.error("Error actualizando cliente:", error);
    }
  };
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <div>
      <Breadcrumbs>
        <Link href="/equipos" className="opacity-60 hover:text-yellow-900">
          Lista equipos
        </Link>
        <button className="opacity-60" disabled>
          Equipo
        </button>
      </Breadcrumbs>
      <h2 className="font-bold text-2xl text-black mt-5">
        Información del equipo
      </h2>
      <small className=" text-black">Complete el siguiente formulario</small>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-dashed rounded-lg border-2 bg-white"
      >
        <Input
          label="Referencia"
          name="referencia"
          register={register}
          rules={{ required: true }}
          errors={errors}
        />
        <Input
          label="Serial"
          name="serial"
          register={register}
          rules={{ required: true }}
          errors={errors}
        />
        <Select
          label={"Marca"}
          name={"marca"}
          setValue={setValue}
          value={marca}
          register={register}
          rules={{ required: true }}
          options={[
            {
              label: "NIKON",
              value: "NIKON",
            },
            {
              label: "CANON",
              value: "CANON",
            },
            {
              label: "SONY",
              value: "SONY",
            },
            {
              label: "FUJIFILM",
              value: "FUJIFILM",
            },
            {
              label: "OLYMPUS",
              value: "OLYMPUS",
            },
            {
              label: "PENTAX",
              value: "PENTAX",
            },
            {
              label: "CASIO",
              value: "CASIO",
            },
            {
              label: "HONOR",
              value: "HONOR",
            },
            {
              label: "XIAOMI",
              value: "XIAOMI",
            },
          ]}
        />

        <Textarea
          label={"Descripcion"}
          name={"descripcion"}
          register={register}
          rules={{ required: false }}
        />
        <Textarea
          label={"Observaciones"}
          name={"observaciones"}
          register={register}
          rules={{ required: false }}
        />
        <Input
          label={"Fecha Factura"}
          name={"fecha_factura"}
          register={register}
          rules={{ required: false }}
          type="date"
        />
        <Input
          label={"No factura"}
          name={"no_factura"}
          register={register}
          rules={{ required: false }}
          type="text"
        />

        <div className="w-full col-span-1 md:col-span-2 text-right p-5">
          <Link href="../equipos" className="m-2 text-black">
            Cancelar
          </Link>
          <Button type="submit" color="yellow" className="m-2">
            Guardar
          </Button>
        </div>
      </form>

      {idEquipo !== "create" && (
        <div className="mt-5 border-2 border-dashed rounded-lg p-5">
          <small className="text-blue-gray-800 text-xl">Detalle</small>
          <Accordion open={open === 1}>
            <AccordionHeader onClick={() => handleOpen(1)}>
              Ordenes de Servicio
            </AccordionHeader>
            <AccordionBody>
              <Link href={"../orders/create"} color="yellow" className="m-2 float-end p-2 bg-black rounded-lg text-white font-bold">
                Nueva Orden de Servicio
              </Link>
              <table className="mt-4 w-full min-w-max table-auto text-left dark:border-gray-700">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  onClick={() => handleSort(head)}
                  className="cursor-pointer border-y border-blue-gray-100  p-4 transition-colors hover:bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 dark:text-white"
                  >
                    {head}{" "}
                    {index !== TABLE_HEAD.length - 1 && (
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    )}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataOrders.map(({ id, etapa, tipo, razonSocial,usuario_creado,fecha_creacion }, index) => {
              const isLast = index === dataOrders.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={id}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <Tooltip content="Editar Orden">
                          <Link
                            href={"../orders/" + id}
                            variant="small"
                            className="font-normal opacity-70 text-yellow-800 border-b-2 dark:text-white"
                          >
                            OS-{id}
                          </Link>
                        </Tooltip>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal dark:text-white"
                      >
                        {etapa}
                      </Typography>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal opacity-70 dark:text-white"
                      ></Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="w-max">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal dark:text-white"
                      >
                        {tipo}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal dark:text-white"
                    >
                      {razonSocial}
                    </Typography>
                  </td>
                  <td>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal dark:text-white"
                    >{fecha_creacion}</Typography>
                  </td>
                  <td>
                  <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal dark:text-white"
                    >{usuario_creado}</Typography>
                  </td>
                  <td className={classes}>
                    <Tooltip content="Generar impresion">
                      <Link href={"../orders/" + id + "/document"}>
                        <IconButton variant="text">
                          <DocumentIcon className="h-4 w-4 dark:text-white" />
                        </IconButton>
                      </Link>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
            </AccordionBody>
          </Accordion>
          {/* <Accordion open={open === 2}>
            <AccordionHeader onClick={() => handleOpen(2)}>
              How to use Material Tailwind?
            </AccordionHeader>
            <AccordionBody>
              We&apos;re not always in the position that we want to be at. We&apos;re constantly
              growing. We&apos;re constantly making mistakes. We&apos;re constantly trying to express
              ourselves and actualize our dreams.
            </AccordionBody>
          </Accordion>
          <Accordion open={open === 3}>
            <AccordionHeader onClick={() => handleOpen(3)}>
              What can I do with Material Tailwind?
            </AccordionHeader>
            <AccordionBody>
              We&apos;re not always in the position that we want to be at. We&apos;re constantly
              growing. We&apos;re constantly making mistakes. We&apos;re constantly trying to express
              ourselves and actualize our dreams.
            </AccordionBody>
          </Accordion> */}
        </div>
      )}
    </div>
  );
}
