"use client";
const API_BASE_URL  = process.env.NEXT_PUBLIC_API_BASE_URL;
import React, { useState, useEffect } from "react";
import Textarea from "../../components/ui/Textarea";

import {
  Breadcrumbs,
  Switch,
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const fetchData = async () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
    credentials: "include",
  };

  try {
    const response = await fetch(
      `${API_BASE_URL}/comunication/horarios/`,
      requestOptions
    );
    // Verificar el estado de la respuesta
    if (!response.ok) {
      // Obtener el mensaje de error del cuerpo de la respuesta
      const errorData = await response.json();
      throw errorData;
    }
    console.log(response);
    // Convertir la respuesta a JSON
    const result = await response.json();
    return result;
  } catch (error) {
    // Manejar errores de red o de la API
    // console.error('Error actualizando los datos del cliente:', error);
    throw error;
  }
};

export function SortableTable() {
  const [horarios, setHorarios] = useState(null);

  useEffect(() => {
    const loadClientData = async () => {
      console.log("hola");
      const data = await fetchData();
      console.log(data);
      setHorarios(data);
    };

    loadClientData();
  }, []); // <-- Vacía la lista de dependencias para que solo se ejecute una vez al montar el componente

  const adicionarHorario = () => {
    MySwal.fire({
      icon: "question",
      text: "¿Desea adicionar un nuevo horario de envío?",
      showCancelButton: true,
      confirmButtonText: "Sí, adicionar",
      confirmButtonColor: "#FFEB3B",
    }).then((data) => {
      if (data.isConfirmed) {
        setHorarios((prevState) => ({
          ...prevState,
          horarios: [...prevState.horarios, { dias: 0, hora: "00:00:00" }],
        }));
      }
    });
  };

  const eliminarHorario = (index) => {
    setHorarios((prevState) => ({
      ...prevState,
      horarios: prevState.horarios.filter((_, i) => i !== index),
    }));
  };

  const handleGuardar = async() => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(horarios),
      redirect: "follow",
      credentials: "include",
    };
  
    const response = await fetch(
      `${API_BASE_URL}/comunication/horarios`,
      requestOptions
    );
    const result = await response.json();
    MySwal.fire({
      text: result.message,
      icon:"success",
      showConfirmButton:false,
      toast:true,
      position:"bottom",
      timer:3000
    })
    return result;
  };

  const handleMensajeChange = (e) => {
    setHorarios((prevState) => ({
      ...prevState,
      mensaje: e.target.value,
    }));
  };

  const handleHorarioChange = (index, key, value) => {
    const nuevosHorarios = [...horarios.horarios];
    nuevosHorarios[index][key] = value;
    setHorarios((prevState) => ({
      ...prevState,
      horarios: nuevosHorarios,
    }));
  };

  const handleSwitchChange = () => {
    setHorarios((prevState) => ({
      ...prevState,
      activo: !prevState.activo,
    }));
  };

  // Render loading state while data is being fetched
  if (!horarios) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Breadcrumbs>
        <Link href="/" className="opacity-60 hover:text-yellow-900">
          Home
        </Link>
        <button className="opacity-60" disabled>
          Comunicación
        </button>
      </Breadcrumbs>

      <Card className="h-full w-full m-auto mt-5 shadow-none border-2 border-dashed p-5">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Comunicación
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              {/* <Link href={"clients/create"} className="flex items-center gap-3 bg-yellow-500 rounded-lg p-2 text-black text-sm" size="sm">
                            <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Crear Nuevo
                        </Link> */}
            </div>
          </div>

          {/* <Button variant='outlined' className='border-yellow-500 text-balnk' size='sm'>Exportar Datos</Button> */}
        </CardHeader>
        <CardBody className="overflow-auto px-0">
          <Card className="w-full bg-gray-50 shadow-none">
            <CardBody>
              <Typography variant="h5" color="blue-gray" className="mb-2 w-full">
                <Switch
                  color="yellow"
                  className="mr-2"
                  checked={horarios.activo}
                  onChange={handleSwitchChange}
                /> 
                Recordatorios por Email <b className="text-sm">Automático</b>
              </Typography>
              <Typography>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <small>
                      Permitir que tus clientes reciban un recordatorio de mantenimiento de 6 meses
                    </small>
                    <br />
                    <Button className="p-2 m-2" color="yellow" onClick={adicionarHorario}>
                      Adicionar Horario
                    </Button>

                    {horarios.horarios.map((item, index) => (
                      <div className="flex mt-1" key={index}>
                        <div>
                          <Input
                            label="Días antes"
                            type="number"
                            value={item.dias}
                            onChange={(e) =>
                              handleHorarioChange(index, "dias", e.target.value)
                            }
                          />
                        </div>
                        <div className="ml-3">
                          <Input
                            label="Hora"
                            type="time"
                            value={item.hora}
                            onChange={(e) =>
                              handleHorarioChange(index, "hora", e.target.value)
                            }
                          />
                        </div>
                        <Button
                          className="ml-2"
                          color="red"
                          size="sm"
                          onClick={() => eliminarHorario(index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 col-span-2 md:col-span-1">
                    <div className="bg-yellow-50 p-5 rounded-lg">
                      <b>Etiquetas</b>
                      <br />
                      <small>@propietario: Nombre del representante legal</small>
                      <br />
                      <small>@fecha: Fecha del proximo mantenimiento</small>
                    </div>
                    <Textarea
                      label={"Mensaje"}
                      rows="20"
                      value={horarios.mensaje}
                      onChange={handleMensajeChange}
                    />
                    <Button className="float-end" color="yellow" onClick={handleGuardar}>
                      Guardar
                    </Button>
                  </div>
                </div>
              </Typography>
            </CardBody>
            <CardFooter className="pt-0"></CardFooter>
          </Card>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4"></CardFooter>
      </Card>
    </>
  );
}

export default SortableTable;
