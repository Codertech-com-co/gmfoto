"use client";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Input from "../../../components/ui/Input";
import { Button } from "@material-tailwind/react";
import { Breadcrumbs } from "@material-tailwind/react";
import { useRouter } from 'next/navigation';

const MySwal = withReactContent(Swal);

const fetchClientData = async (clientId) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const response = await fetch(`http://127.0.0.1:3001/clients/${clientId}`, requestOptions);
  const result = await response.json();
  return result[0];
};

const updateClientData = async (clientId, data) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    redirect: "follow",
  };

  const response = await fetch(`http://127.0.0.1:3001/clients/${clientId}`, requestOptions);
  const result = await response.json();
  return result;
};
const insertClientData = async ( data) => {
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
  const clientId = params.id; // Reemplaza esto con la forma en que obtienes el ID del cliente
  const router = useRouter();

  useEffect(() => {
    const loadClientData = async () => {
      const clientData = await fetchClientData(clientId);
      setClient(clientData);

      // Resetear el formulario con los datos del cliente
      reset(clientData);
    };

    loadClientData();
  }, [clientId, reset]);

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      if (clientId =='create'){
        const insert = await insertClientData( data);
      }else{
        const updatedClient = await updateClientData(clientId, data);
      }
      
      MySwal.fire({
        title:"Datos Guardados",
        icon:"success",
        toast:true,
        position:"bottom",
        showConfirmButton:false,
        timer:3000,
        timerProgressBar:false,
        
      })
      setTimeout(()=>{
        router.push('/clients');
      },500)
      
      // console.log("Cliente actualizado:", updatedClient);
    } catch (error) {
      MySwal.fire({
        title:"Error actualizando cliente",
        icon:"error",
        toast:true,
        position:"bottom",
        showConfirmButton:false,
        timer:5000,
        timerProgressBar:false,
        
      })
      // console.error("Error actualizando cliente:", error);
    }
  };

  return (
    <div>
      <Breadcrumbs>
        <Link href="/clients" className="opacity-60 hover:text-yellow-900">
          Lista clientes
        </Link>
        <button className="opacity-60" disabled>
          Cliente
        </button>
      </Breadcrumbs>
      <h2 className="font-bold text-2xl text-black mt-5">Cliente</h2>
      <small className=" text-black">
        Complete el siguiente formulario para este cliente
      </small>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-dashed rounded-lg border-2 bg-white"
      >
        <b className='text-black col-span-2'>Datos Empresa</b>
        <Input
          label="Identificación"
          name="documento"
          register={register}
          rules={{ required: true }}
          errors={errors}
        />
        <Input
          label="Razón Social"
          name="razonSocial"
          register={register}
          rules={{ required: true }}
          errors={errors}
        />
        <Input
          label="Nombre Establecimiento"
          name="NombreEstablecimiento"
          register={register}
          errors={errors}
        />
        <Input
          label="WhatsApp"
          name="whatsApp"
          register={register}
          errors={errors}
        />
        <Input
          label="Teléfono"
          name="telefonoEstablecimiento"
          register={register}
          errors={errors}
        />
        <Input
          label="Correo Electrónico"
          name="email"
          register={register}
          rules={{
            pattern: {
              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
              message: "Email no válido"
            }
          }}
          errors={errors}
        />
        <Input
          label="Propietario"
          name="propietario"
          register={register}
          errors={errors}
        />
        <Input
          label="Dirección"
          name="direccion"
          register={register}
          errors={errors}
        />
        <Input
          label="Ciudad"
          name="ciudad"
          register={register}
          errors={errors}
        />
        <Input
          label="Celular"
          name="celularPropietario"
          register={register}
          errors={errors}
        />
        <Input
          label="Página Web"
          name="paginaWeb"
          register={register}
          errors={errors}
        />
        <Input
          label="Tipo Gestión"
          name="tipoGestion"
          register={register}
          errors={errors}
        />
        <b className='text-black col-span-2'>Datos de Contacto</b>
        <Input
          label="Nombre persona de Contacto"
          name="nombrePersonaContacto"
          register={register}
          errors={errors}
        />
        

        <div className="w-full col-span-1 md:col-span-2 text-right p-5">
          <Link href="../clients" className="m-2 text-black">Cancelar</Link>
          <Button type="submit" color="yellow" className="m-2">Guardar</Button>
          
        </div>
      </form>
    </div>
  );
}
