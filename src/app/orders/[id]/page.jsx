"use client";
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
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
} from "@material-tailwind/react";
import { fetchClients } from "../../../utils/api/clients";
import { fetchEquipos } from "../../../utils/api/equipos";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
// import Select from "react-tailwindcss-select";

const MySwal = withReactContent(Swal);

const fetchClientData = async (idEquipo) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const response = await fetch(
    `http://127.0.0.1:3001/clients/${idEquipo}`,
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
  };

  const response = await fetch(
    `http://127.0.0.1:3001/clients/${idEquipo}`,
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
  };

  const response = await fetch(
    `http://127.0.0.1:3001/clients/`,
    requestOptions
  );
  const result = await response.json();
  return result;
};

const ClientForm = ({ params }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [client, setClient] = useState(null);
  const idEquipo = params.id; // Reemplaza esto con la forma en que obtienes el ID del cliente
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [equipos, setEquipos] = useState([]);

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

      // setClient(clientData);

      // Resetear el formulario con los datos del cliente
      // reset(clientData);
    };

    loadClientData();
  }, [idEquipo, reset]);

  const onSubmit = async (data) => {
    console.log('Form data:', data); // Asegúrate de que esto se ejecute

    try {
      if (idEquipo === 'create') {
        // const insert = await insertClientData(data);
      } else {
        // const updatedClient = await updateClientData(idEquipo, data);
      }

      MySwal.fire({
        title: 'Datos Guardados',
        icon: 'success',
        toast: true,
        position: 'bottom',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: false,
      });
      setTimeout(() => {
        // router.push('/clients');
      }, 500);

      // console.log('Cliente actualizado:', updatedClient);
    } catch (error) {
      MySwal.fire({
        title: 'Error actualizando cliente',
        icon: 'error',
        toast: true,
        position: 'bottom',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: false,
      });
      // console.error('Error actualizando cliente:', error);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-2xl text-blue-gray-800 mt-5">Orden de servicio</h2>
      <small className="text-blue-gray-800">Complete el siguiente formulario</small>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-dashed rounded-lg border-2"
      >
        <Select
          label="Area"
          name="area"
          register={register}
          rules={{ required: true }}
          setValue={setValue}
          options={[
            { label: 'Servicio Técnico', value: 'servicio_tecnico', selected: true },
          ]}
        />
        <Select
          label="Tipo"
          name="tipo"
          register={register}
          rules={{ required: true }}
          setValue={setValue}
          options={[
            { label: 'Garantía', value: 'garantia' },
            { label: 'Fuera de Garantía', value: 'fuera_de_garantia' },
          ]}
        />
        <Select
          label="Etapa"
          name="etapa"
          register={register}
          rules={{ required: true }}
          primaryColor="amber"
          setValue={setValue}
          options={[
            { label: 'Nuevo', value: 'nuevo' },
            { label: 'Asignado', value: 'asignado' },
            { label: 'En proceso', value: 'en_proceso' },
            { label: 'Ejecutado', value: 'ejecutado' },
            { label: 'Cerrado', value: 'cerrado' },
            { label: 'Cotizado', value: 'cotizado' },
          ]}
        />

        <br />
        <Typography className="text-blue-gray-700" variant="h4">Datos Cliente</Typography>
        <br />
        <Select
          label="Cliente"
          name="cliente"
          register={register}
          setValue={setValue}
          rules={{ required: true }}
          errors={errors}
          options={clients}
        />

        <br />
        <Typography className="text-blue-gray-700" variant="h4">Datos del producto</Typography>
        <br />
        <Select
          label="Equipo"
          name="equipo"
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
          rules={{ required: true }}
          setValue={setValue}
          options={[
            { label: 'Recolección domicilio', value: 'recoleccion_domicilio' },
            { label: 'Recolección transportadora', value: 'recoleccion_transportadora' },
            { label: 'Recolección Cota', value: 'recoleccion_cota' },
            { label: 'Recolección StaFé Btá', value: 'recoleccion_stafe_bogota' },
            { label: 'Recolección StaFé Mde', value: 'recoleccion_stafe_mde' },
            { label: 'Recolección Fabricato', value: 'recoleccion_fabricato' },
            { label: 'Recolección Gran Estación', value: 'recoleccion_gran_estacion' },
            { label: 'Recolección Plaza Claro', value: 'recoleccion_plaza_claro' },
          ]}
        />
        <Select
          label="Persona que recibe el Producto"
          name="persona_que_recibe"
          register={register}
          rules={{ required: true }}
          setValue={setValue}
          options={[
            { label: 'Duvan Camilo Ayala', value: '123456789' },
          ]}
        />
        <Select
          label="Transportadora"
          name="transportadora"
          register={register}
          rules={{ required: true }}
          setValue={setValue}
          options={[
            { label: 'TCC', value: 'TCC' },
            { label: 'SERVIENTREGA', value: 'SERVIENTREGA' },
            { label: 'INTERRAPIDISIMO', value: 'INTERRAPIDISIMO' },
            { label: 'COORDINADORA', value: 'COORDINADORA' },
            { label: 'ENVIA', value: 'ENVIA' },
            { label: 'DEPRISA', value: 'DEPRISA' },
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
          register={register}
          rules={{ required: true }}
          setValue={setValue}
          isMultiple={true}
          options={[
            { label: 'POR VALIDAR', value: 'POR_VALIDAR' },
            { label: 'BUEN ESTADO', value: 'BUEN_ESTADO' },
            { label: 'DEFORMADO', value: 'DEFORMADO' },
            { label: 'LCD AVERIADO', value: 'LCD_AVERIADO' },
            { label: 'GOLPEADO', value: 'GOLPEADO' },
            { label: 'RAYADO', value: 'RAYADO' },
          ]}
        />

        <br />
        <Typography className="text-blue-gray-700" variant="h4">INFORMACIÓN DE SERVICIO TECNICO</Typography>
        <br />

        <Textarea
          label="Diagnostico"
          name="diagnostico"
          register={register}
        />
        <Textarea
          label="Repuestos a Importar"
          name="repuestosImportar"
          register={register}
        />

        <Select
          label="Requiere Importación"
          name="requiere_importacion"
          register={register}
          rules={{ required: true }}
          setValue={setValue}
          options={[
            { label: 'SI', value: 'SI' },
            { label: 'NO', value: 'NO' },
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
          name="fechaCierre"
          register={register}
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
      desc: <ClientForm params />,
    },
    {
      label: "Bitácora de labores realizadas",
      value: "bitacora",
      desc: <Bitacora params />,
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
