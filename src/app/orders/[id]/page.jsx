"use client";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";
import { Button } from "@material-tailwind/react";
import { Breadcrumbs } from "@material-tailwind/react";
import { useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography
} from "@material-tailwind/react";

const MySwal = withReactContent(Swal);

const fetchClientData = async (idEquipo) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const response = await fetch(`http://127.0.0.1:3001/clients/${idEquipo}`, requestOptions);
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
  };

  const response = await fetch(`http://127.0.0.1:3001/clients/${idEquipo}`, requestOptions);
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
  };

  const response = await fetch(`http://127.0.0.1:3001/clients/`, requestOptions);
  const result = await response.json();
  return result;
};

export default function ClientForm({ params }) {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [client, setClient] = useState(null);
  const idEquipo = params.id; // Reemplaza esto con la forma en que obtienes el ID del cliente
  const router = useRouter();

  useEffect(() => {
    const loadClientData = async () => {
      const clientData = await fetchClientData(idEquipo);
      setClient(clientData);

      // Resetear el formulario con los datos del cliente
      reset(clientData);
    };

    loadClientData();
  }, [idEquipo, reset]);

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      if (idEquipo == 'create') {
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

      })
      setTimeout(() => {
        router.push('/clients');
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

      })
      // console.error("Error actualizando cliente:", error);
    }
  };
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <div>
      <Breadcrumbs>
        <Link href="/orders" className="opacity-60 hover:text-yellow-900">
          Lista Ordenes
        </Link>
        <button className="opacity-60" disabled>
          Orden
        </button>
      </Breadcrumbs>
      <h2 className="font-bold text-2xl text-black mt-5">Orden de compra</h2>
      <small className=" text-black">
        Complete el siguiente formulario
      </small>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-dashed rounded-lg border-2"
      >
        <Select
          label={'Area'}
          options={[
            {
              label: "Servicio Técnico",
              value: "servicio_tecnico"
            }
          ]} />
        <Select
          label={'Tipo'}
          options={[
            {
              label: "Garantía",
              value: "garantia"
            },
            {
              label: "Fuera de Garantía",
              value: "fuera_de_garantia"
            }
          ]} />
        <Select
          label={'Etapa'}
          options={[
            {
              label: "Nuevo",
              value: "nuevo",
            },
            {
              label: "Asignado",
              value: "asignado",
            },
            {
              label: "En proceso",
              value: "en_proceso",
            },
            {
              label: "Ejecutado",
              value: "ejecutado",
            },
            {
              label: "Cerrado",
              value: "cerrado",
            },
            {
              label: "Cotizado",
              value: "cotizado",
            },
          ]} />

        <br />
        <Typography className='text-blue-gray-700' variant='h4'>Datos Cliente</Typography>
        <br />
        <Select
          label={'Cliente'}
          options={[
            {
              label: "Garantía",
              value: "garantia"
            },
            {
              label: "Fuera de Garantía",
              value: "fuera_de_garantia"
            }
          ]} />


        <br />
        <Typography className='text-blue-gray-700' variant='h4'>Datos del producto</Typography>
        <br />
        <Textarea
        label={'Accesorios'}/>
        <Textarea
        label={'Falla Reportada'}/>
        <Select
          label={'Proceso Logístico'}
          options={[
            {
              label: "Garantía",
              value: "garantia"
            },
            {
              label: "Fuera de Garantía",
              value: "fuera_de_garantia"
            }
          ]} />
        <Select
          label={'Persona que recibe el Producto'}
          options={[
            {
              label: "Garantía",
              value: "garantia"
            },
            {
              label: "Fuera de Garantía",
              value: "fuera_de_garantia"
            }
          ]} />
        <Select
          label={'Transportadora'}
          options={[
            {
              label: "Garantía",
              value: "garantia"
            },
            {
              label: "Fuera de Garantía",
              value: "fuera_de_garantia"
            }
          ]} />
          <Input
          label={'Guía de Envió'}/>
          <Select
          label={'Estado del Producto'}
          options={[
            {
              label: "Garantía",
              value: "garantia"
            },
            {
              label: "Fuera de Garantía",
              value: "fuera_de_garantia"
            }
          ]} />




        <div className="w-full col-span-1 md:col-span-2 text-right p-5">
          <Link href="../equipos" className="m-2 text-black">Cancelar</Link>
          <Button type="submit" color="yellow" className="m-2">Guardar</Button>

        </div>
      </form>

      {idEquipo !== 'create' && (
        <div className='mt-5 border-2 border-dashed rounded-lg p-5'>
          <small className='text-blue-gray-800 text-xl'>Detalle</small>
          <Accordion open={open === 1} >
            <AccordionHeader onClick={() => handleOpen(1)}>Ordenes de Servicio</AccordionHeader>
            <AccordionBody>
              <Button color="yellow" className="m-2">Nuevo</Button>
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
