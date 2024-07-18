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
import { Button, Breadcrumbs, Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { fetchClients } from "../../../utils/api/clients";
import { fetchEquipos } from "../../../utils/api/equipos";
import datetimeToDate from "../../../../libs/datetimeToDate";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

const MySwal = withReactContent(Swal);

const fetchClientData = async (idEquipo) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const response = await fetch(
    `${API_BASE_URL}/orders/${idEquipo}`,
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

  try {
    const response = await fetch(
      `${API_BASE_URL}/orders/${idEquipo}`,
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
  } catch (error) {
    // Manejar errores de red o de la API
    // console.error('Error actualizando los datos del cliente:', error);
    throw error;
  }
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
  try {
  const response = await fetch(`${API_BASE_URL}/orders/`, requestOptions);
   // Verificar el estado de la respuesta
   if (!response.ok) {
    // Obtener el mensaje de error del cuerpo de la respuesta
    const errorData = await response.json();
    throw errorData;
  }

  // Convertir la respuesta a JSON
  const result = await response.json();
  return result;
} catch (error) {
  throw error;
}

};

const ClientForm = ({ params }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [order, setOrder] = useState(null);
  const idEquipo = params.id;
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [area, setArea] = useState("");
  const [tipo, setTipo] = useState("");
  const [etapa, setEtapa] = useState("");
  const [procesoLogistico, setProcesoLogistico] = useState("");
  const [personaRecibe, setPersonaRecibe] = useState("");
  const [trasportadora, setTrasportadora] = useState("");
  // const [estadoProducto, setEstadoProducto] = useState(`"['POR_VALIDAR']"`);
  const [estadoProducto, setEstadoProducto] = useState(['POR_VALIDAR']);
  const [requiereImportacion, setRequiereImportacion] = useState("");
  const [idCliente, setIdCliente] = useState(null);
  const [equipo, setEquipo] = useState(null);

  useEffect(() => {
    const loadClientData = async () => {
      
        var listClients = await fetchClients();
        listClients = listClients.map((data) => ({
          label: data.razonSocial,
          value: data.id,
        }));
        setClients(listClients);
      

      

      var listEquipos = await fetchEquipos();
      listEquipos = listEquipos.map((data) => ({
        label: data.serial,
        value: data.id,
      }));
      setEquipos(listEquipos);
      if (idEquipo !== "create") {

      const orderData = await fetchClientData(idEquipo);
      let dataOrder = {
        ...orderData,
        fecha_cierre: orderData.fecha_cierre ? orderData.fecha_cierre.split(".")[0] : "",
        fecha_proxima: datetimeToDate(orderData.fecha_proxima)
      };

      setOrder(orderData);
      setArea(orderData.area);
      setTipo(orderData.tipo);
      setEtapa(orderData.etapa);
      setProcesoLogistico(orderData.proceso_logistico);
      setPersonaRecibe(orderData.persona_que_recibe);
      setTrasportadora(orderData.transportadora);
      setEstadoProducto(JSON.parse(orderData.estado_del_producto));
      setRequiereImportacion(orderData.requiere_importacion);
      setIdCliente(orderData.cliente);
      setEquipo(orderData.equipo);

      // Resetear el formulario con los datos del cliente si orderData tiene datos
      if (orderData) {
        reset(dataOrder);
      }
    }
    };

    loadClientData();
  }, [idEquipo, idCliente, equipo, reset]);

  const onSubmit = async (data) => {
    console.log("Form data:", data); // Asegúrate de que esto se ejecute

    try {
      if (idEquipo === "create") {
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
        router.push("/orders");
      }, 500);
    } catch (error) {
      if (error.error[0].instancePath) {
        MySwal.fire({
          title: "Error, por favor ingrese todos los datos para guardar",
          icon: "error",
          toast: true,
          position: "bottom",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: false,
        });
      } else {
        MySwal.fire({
          title: "Error al guardar ",
          icon: "error",
          toast: true,
          position: "bottom",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: false,
        });
      }
    }
  };

  return (
    <div>
      <h2 className="font-bold text-2xl text-blue-gray-800 mt-5">
        Orden de servicio
      </h2>
      <small className="text-blue-gray-800">
        Complete el siguiente formulario
      </small>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-dashed rounded-lg border-2"
      >
        <Select
          label="Area"
          name="area"
          value={area}
          register={register}
          rules={{ required: true }}
          setValue={setValue}
          options={[
            {
              label: "Servicio Técnico",
              value: "servicio_tecnico",
              selected: true,
            },
          ]}
        />
        <Select
          label="Tipo"
          name="tipo"
          value={tipo}
          register={register}
          rules={{ required: true }}
          setValue={setValue}
          options={[
            { label: "Garantía", value: "garantia" },
            { label: "Fuera de Garantía", value: "fuera_de_garantia" },
          ]}
        />
        <Select
          label="Etapa"
          name="etapa"
          value={etapa}
          register={register}
          rules={{ required: true }}
          primaryColor="amber"
          setValue={setValue}
          options={[
            { label: "Nuevo", value: "nuevo" },
            { label: "Asignado", value: "asignado" },
            { label: "En proceso", value: "en_proceso" },
            { label: "Ejecutado", value: "ejecutado" },
            { label: "Cerrado", value: "cerrado" },
            { label: "Cotizado", value: "cotizado" },
          ]}
        />

        <br />
        <Typography className="text-blue-gray-700" variant="h4">
          Datos Cliente
        </Typography>
        <br />
        <Select
          label="Cliente"
          name="cliente"
          value={idCliente}
          register={register}
          setValue={setValue}
          rules={{ required: true }}
          errors={errors}
          options={clients}
        />

        <br />
        <Typography className="text-blue-gray-700" variant="h4">
          Datos del producto
        </Typography>
        <br />
        <Select
          label="Equipo"
          name="equipo"
          value={equipo}
          register={register}
          setValue={setValue}
          rules={{ required: true }}
          errors={errors}
          options={equipos}
        />

        <br />
        <Textarea
          name="accesorios"
          register={register}
          rules={{ required: true }}
          errors={errors}
          label="Accesorios"
        />
        <Textarea
          label="Falla Reportada"
          name="falla_reportada"
          register={register}
          rules={{ required: false }}
        />
        <Select
          label="Proceso Logístico"
          name="proceso_logistico"
          register={register}
          value={procesoLogistico}
          rules={{ required: true }}
          setValue={setValue}
          options={[
            { label: "Recolección domicilio", value: "recoleccion_domicilio" },
            {
              label: "Recolección transportadora",
              value: "recoleccion_transportadora",
            },
            { label: "Recolección Cota", value: "recoleccion_cota" },
            {
              label: "Recolección StaFé Btá",
              value: "recoleccion_stafe_bogota",
            },
            { label: "Recolección StaFé Mde", value: "recoleccion_stafe_mde" },
            { label: "Recolección Fabricato", value: "recoleccion_fabricato" },
            {
              label: "Recolección Gran Estación",
              value: "recoleccion_gran_estacion",
            },
            {
              label: "Recolección Plaza Claro",
              value: "recoleccion_plaza_claro",
            },
          ]}
        />
        <Select
          label="Persona que recibe el Producto"
          name="persona_que_recibe"
          value={personaRecibe}
          register={register}
          rules={{ required: true }}
          setValue={setValue}
          options={[{ label: "Duvan Camilo Ayala", value: "123456789" }]}
        />
        <Select
          label="Transportadora"
          name="transportadora"
          register={register}
          value={trasportadora}
          rules={{ required: true }}
          setValue={setValue}
          options={[
            { label: "TCC", value: "TCC" },
            { label: "SERVIENTREGA", value: "SERVIENTREGA" },
            { label: "INTERRAPIDISIMO", value: "INTERRAPIDISIMO" },
            { label: "COORDINADORA", value: "COORDINADORA" },
            { label: "ENVIA", value: "ENVIA" },
            { label: "DEPRISA", value: "DEPRISA" },
          ]}
        />
        <Input
          label="Guía de Envió"
          name="guia"
          register={register}
          rules={{ required: false }}
        />
        <Select
          label="Estado del Producto"
          name="estado_del_producto"
          value={estadoProducto}
          register={register}
          rules={{ required: true }}
          setValue={setValue}
          isMultiple={true}
          options={[
            { label: "POR VALIDAR", value: "POR_VALIDAR" },
            { label: "BUEN ESTADO", value: "BUEN_ESTADO" },
            { label: "DEFORMADO", value: "DEFORMADO" },
            { label: "LCD AVERIADO", value: "LCD_AVERIADO" },
            { label: "GOLPEADO", value: "GOLPEADO" },
            { label: "RAYADO", value: "RAYADO" },
          ]}
        />

        <br />
        <Typography className="text-blue-gray-700" variant="h4">
          INFORMACIÓN DE SERVICIO TECNICO
        </Typography>
        <br />

        <Textarea label="Diagnostico" name="diagnostico" register={register} />
        <Textarea
          label="Repuestos a Importar"
          name="repuestos_importar"
          register={register}
        />

        <Select
          label="Requiere Importación"
          name="requiere_importacion"
          register={register}
          rules={{ required: true }}
          setValue={setValue}
          value={requiereImportacion}
          options={[
            { label: "SI", value: "SI" },
            { label: "NO", value: "NO" },
          ]}
        />

        <Textarea
          label="Observaciones"
          name="observaciones"
          register={register}
        />

        <Input
          label="Fecha cierre"
          type="datetime-local"
          name="fecha_cierre"
          register={register}
        />
        <Input
          label="Fecha Proxima"
          type="date"
          name="fecha_proxima"
          register={register}
        />

        <div className="w-full col-span-1 md:col-span-2 text-right p-5">
          <Link href="../orders" className="m-2 text-black">
            Cancelar
          </Link>
          <Button type="submit" color="yellow" className="m-2">
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};

function Bitacora({ params }) {
  return (
    <div className="h-[80vh] mt-5">
      <Typography variant="h4">Bitácora</Typography>
      <br />
      <Button color="white" className="float-right">
        Agregar labor
      </Button>
      <br />

      <table className="w-full   text-center">
        <thead>
          <tr>
            <th></th>
            <th>Técnico</th>
            <th>Labor realizada</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1.</td>
            <td className="p-3">
              <Select label={""} options={[]} />
            </td>
            <td className="p-3">
              <Textarea label={""} />
            </td>
            <td>
              <Button color="red">Eliminar</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function TabsCustomAnimation({ params }) {
  const data = [
    {
      label: "Información Basica Y Equipo",
      value: "info",
      desc: <ClientForm params={params} />,
    },
    {
      label: "Bitácora de labores realizadas",
      value: "bitacora",
      desc: <Bitacora params={params} />,
    },
  ];

  return (
    <>
      <Breadcrumbs>
        <Link href="/orders" className="opacity-60 hover:text-yellow-900">
          Lista Ordenes
        </Link>
        <button className="opacity-60" disabled>
          Orden
        </button>
      </Breadcrumbs>
      <br />
      <Tabs id="custom-animation" value="info">
        <TabsHeader>
          {data.map(({ label, value }) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody
          animate={{
            initial: { y: 250 },
            mount: { y: 0 },
            unmount: { y: 250 },
          }}
        >
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              {desc}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </>
  );
}
