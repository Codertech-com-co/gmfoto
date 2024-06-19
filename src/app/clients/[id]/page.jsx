"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Input from "../../../components/ui/Input";
import { Button } from "@material-tailwind/react";
import { Breadcrumbs } from "@material-tailwind/react";

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

export default function ClientForm( {params}) {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [client, setClient] = useState(null);
  const clientId = params.id; // Reemplaza esto con la forma en que obtienes el ID del cliente

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
    console.log(data);
    try {
      const updatedClient = await updateClientData(clientId, data);
      console.log("Cliente actualizado:", updatedClient);
    } catch (error) {
      console.error("Error actualizando cliente:", error);
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
        className="p-5 mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-dashed rounded-lg border-2"
      >
        <Input
          label="Documento"
          {...register("documento", { required: true })}
          defaultValue={client?.documento}
        />
        {errors.documento && <span>Este campo es obligatorio</span>}

        <Input
          label="Razón Social"
          {...register("razonSocial", { required: true })}
          defaultValue={client?.razonSocial}
        />
        {errors.razonSocial && <span>Este campo es obligatorio</span>}

        <Input
          label="Nombre Establecimiento"
          {...register("NombreEstablecimiento")}
          defaultValue={client?.NombreEstablecimiento}
        />
        <Input
          label="Teléfono"
          {...register("telefonoEstablecimiento")}
          defaultValue={client?.telefonoEstablecimiento}
        />
        <Input
          label="Correo Electrónico"
          {...register("email", {
            pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
          })}
          defaultValue={client?.email}
        />
        {errors.email && <span>Email no válido</span>}

        <Input
          label="Propietario"
          {...register("propietario")}
          defaultValue={client?.propietario}
        />
        <Input
          label="Dirección"
          {...register("direccion")}
          defaultValue={client?.direccion}
        />
        <Input
          label="Ciudad"
          {...register("ciudad")}
          defaultValue={client?.ciudad}
        />
        <Input
          label="Celular"
          {...register("celularPropietario")}
          defaultValue={client?.celularPropietario}
        />
        <Input
          label="Nombre persona de Contacto"
          {...register("nombrePersonaContacto")}
          defaultValue={client?.nombrePersonaContacto}
        />
        <Input
          label="Página Web"
          {...register("paginaWeb")}
          defaultValue={client?.paginaWeb}
        />
        <Input
          label="Tipo Gestión"
          {...register("tipoGestion")}
          defaultValue={client?.tipoGestion}
        />

        <div className="w-full col-span-1 md:col-span-2 text-right p-5">
          <Link href={"../clients"} className="m-2 text-black">Cancelar</Link>
          <Button type="submit" color="yellow" className="m-2">Guardar</Button>
        </div>
      </form>
    </div>
  );
}
