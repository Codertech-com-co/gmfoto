"use client"
import Link from "next/link";
import Input from "../../../components/ui/Input";
import { Button } from "@material-tailwind/react";
export default () => {
  return (
    <div>
      <h2 className="font-bold text-2xl">Crear Cliente</h2>
      <small>
        Complete el siguiente formulario para registrar un nuevo cliente
      </small>
      <form
        action=""
        className="p-5 mt-5 grid grid-cols-2 gap-4 border-dashed rounded-lg border-2"
      >
        <Input label={"Documento"} />
        <Input label={"Razón Social"} />
        <Input label={"Nombre Establecimiento"} />
        <Input label={"Telefono"} />
        <Input label={"Correo Electrónico"} />
        <Input label={"Propietario"} />
        <Input label={"Dirección"} />
        <Input label={"Ciudad"} />
        <Input label={"Celular"} />
        <Input label={"Nombre persona de Contacto"} />
        <Input label={"Pagina Web"} />
        <Input label={"Tipo Gestion"} />
      </form>

      <div className="w-full text-right p-5">
        <Link href={"../clients"} className="m-2">Cancelar</Link>
        <Button color="yellow" className="m-2">Crear</Button>
      </div>
    </div>
  );
};
