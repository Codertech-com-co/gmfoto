"use client";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Link from "next/link";
import { useForm,useFieldArray  } from "react-hook-form";
import { useEffect, useState } from "react";
import Input from "../../../components/ui/Input";
import Select2 from "../../../components/ui/Select2";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";
import { Button, Breadcrumbs, Typography ,TextField ,MenuItem } from "@material-tailwind/react";
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
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de instalar la librería uuid

const MySwal = withReactContent(Swal);

const fetchClientData = async (idEquipo) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
    credentials: "include",
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
  const [usuarios, setUsuarios] = useState([]);
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
  const [estadoProducto, setEstadoProducto] = useState(["POR_VALIDAR"]);
  const [requiereImportacion, setRequiereImportacion] = useState("");
  const [idCliente, setIdCliente] = useState(null);
  const [equipo, setEquipo] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const loadClientData = async () => {

      let listUser = await getUsuarios();
      listUser = Array.isArray(listUser) ? listUser.map((item) => ({
        label: `${item.names} ${item.lastnames}`,
        value: item.id,
      })) : [];
      setUsuarios(listUser);

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
          fecha_cierre: orderData.fecha_cierre
            ? orderData.fecha_cierre.split(".")[0]
            : "",
          fecha_proxima: datetimeToDate(orderData.fecha_proxima),
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
        setUsuario(orderData.persona_que_recibe);

        // Resetear el formulario con los datos del cliente si orderData tiene datos
        if (orderData) {
          reset(dataOrder);
        }
      }
    };

    loadClientData();
  }, [idEquipo, idCliente, equipo, reset]);

  const onSubmit = async (data) => {
    // console.log("Form data:", data); // Asegúrate de que esto se ejecute

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
        <Select2
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
              Select2ed: true,
            },
          ]}
        />
        <Select2
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
        <Select2
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
        <Select2
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
        <Select2
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
        <Select2
          label="Proceso Logístico"
          name="proceso_logistico"
          register={register}
          value={procesoLogistico}
          rules={{ required: true }}
          setValue={setValue}
          options={[
            { label: "RECOLECCION DOMICILIO", value: "RECOLECCION_DOMICILIO " },
            { label: "ENVIO POR TRASPORTADORA", value: "ENVIO_POR_TRASPORTADORA" },
            { label: "RECEPCION GMFOTO", value: "RECEPCION_GMFOTO" },
           
          ]}
        />
        <Select2
          label="Persona que recibe el Producto"
          name="persona_que_recibe"
          value={usuario}
          register={register}
          rules={{ required: true }}
          setValue={setValue}
          options={usuarios}
        />
        <Select2
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
        <Select2
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

        <Select2
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

const getUsuarios = async () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
    credentials: "include",
  };
  try {
    const response = await fetch(API_BASE_URL + "/users/all", requestOptions);
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

const getLabores = async (order) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
    credentials: "include",
  };
  try {
    const response = await fetch(API_BASE_URL + "/labores/"+order, requestOptions);
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching labores:", error);
    return [];
  }
};

function Bitacora({params}) {
  const order_id = params.id
  const [usuarios, setUsuarios] = useState([]);
  const [labores, setLabores] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      let listUser = await getUsuarios();
      listUser = Array.isArray(listUser) ? listUser.map((item) => ({
        label: `${item.names} ${item.lastnames}`,
        value: item.id,
      })) : [];
      setUsuarios(listUser);

      let listLabores = await getLabores(order_id);
      listLabores = Array.isArray(listLabores) ? listLabores : [];
      setLabores(listLabores);
    };
    loadData();
  }, []);

  const handleLaborChange = (index, field, value) => {
    const updatedLabores = labores.map((labor, i) =>
      i === index ? { ...labor, [field]: value } : labor
    );
    setLabores(updatedLabores);
  };

  const addLabor = () => {
    setLabores([...labores, { id: uuidv4(), tecnico: "", labor: "" }]);
  };

  const removeLabor = (index) => {
    const updatedLabores = labores.filter((_, i) => i !== index);
    setLabores(updatedLabores);
  };

  const saveLabores = () => {
    console.log("Labores guardadas:", labores);
    labores.map(async(item) =>{
      item = {
        ...item,
        order_id
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/labores`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
          credentials: "include",
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        return await response.json();
      } catch (error) {
        console.error('Error posting transaction:', error);
        throw error;
      }

    })
  };

  return (
    <div className="h-[80vh] mt-5">
      <Typography variant="h4">Bitácora</Typography>
      <br />
      <Button color="white" className="float-right" onClick={addLabor}>
        Agregar labor
      </Button>
      <br />
      <br />
      <br />

      <table className="w-full text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>Técnico</th>
            <th>Labor realizada</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {labores.map((labor, index) => (
            <tr key={labor.id}>
              <td>{index + 1}.</td>
              <td className="p-3">
                <select
                  value={labor.tecnico}
                  onChange={(e) =>
                    handleLaborChange(index, "tecnico", e.target.value)
                  }
                  className="w-full h-10 bg-transparent text-blue-gray-700 font-sans font-normal outline-none focus:outline-none border border-blue-gray-200 rounded-[7px] px-2"
                >
                  <option value="" disabled hidden>
                    Seleccione técnico
                  </option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.value} value={usuario.value}>
                      {usuario.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-3">
                <Textarea
                  label=""
                  value={labor.labor}
                  onChange={(e) =>
                    handleLaborChange(index, "labor", e.target.value)
                  }
                />
              </td>
              <td>
                <Button color="red" onClick={() => removeLabor(index)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button color="primary" onClick={saveLabores}>
        Guardar Labores
      </Button>
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
    {
      label: "Repuestos",
      value: "repuestos",
      desc: <RepuestosTab params={params} />,
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







const fetchProducts = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/productos/all`,{
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched products:', data);

    if (!Array.isArray(data)) {
      throw new Error('Invalid data format: Expected an array');
    }

    return data.map(product => ({
      label: `${product.nombre} (Disponible: ${product.cantidad_disponible})`,
      value: product.id,
      cantidadDisponible: product.cantidad_disponible
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};
const fetchProductsOrder = async (order) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transacciones/numero_referencia/${order}`,{
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched products:', data);

    if (!Array.isArray(data)) {
      throw new Error('Invalid data format: Expected an array');
    }

    return data.map(product => ({
      label: `${product.nombre} (Disponible: ${product.cantidad_disponible})`,
      value: product.id,
      cantidadDisponible: product.cantidad_disponible
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

const postTransaction = async (transaction) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transacciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting transaction:', error);
    throw error;
  }
};

const RepuestosTab = ({ params, userName }) => {
  const orderId = params.id
  const [productos, setProductos] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productList = await fetchProducts();
        setProductos(productList);
        const repuestosList = await fetchProductsOrder(orderId)
        setRepuestos(repuestosList)
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    loadProducts();
  }, []);

  const handleAddRepuesto = async (data) => {
    console.log(data)
    const producto = productos.find(p => p.value === data.producto);
    if (!producto) {
      MySwal.fire({
        title: "Error",
        text: "Producto no encontrado.",
        icon: "error"
      });
      return;
    }

    if (parseInt(data.cantidad) > producto.cantidadDisponible) {
      MySwal.fire({
        title: "Error",
        text: "Cantidad excede el stock disponible.",
        icon: "error"
      });
      return;
    }

    const nuevoRepuesto = {
      id: uuidv4(),
      id_producto: data.producto,
      cantidad: data.cantidad,
      orden_id: orderId
    };

    try {
      // Enviar la transacción
      const transaction = {
        tipo: "salida", // Puedes cambiar esto según sea necesario
        id_producto: data.producto,
        id_proveedor: 1, // Puedes cambiar esto si tienes el id del proveedor
        cantidad: data.cantidad,
        cantidad_stock: data.cantidad,
        numero_referencia: orderId
      };
      
      await postTransaction(transaction);
      setRepuestos([...repuestos, nuevoRepuesto]);
      setValue('producto', '');
      setValue('cantidad', '');
      MySwal.fire({
        title: "Éxito",
        text: "Repuesto agregado exitosamente.",
        icon: "success"
      });
    } catch (error) {
      MySwal.fire({
        title: "Error",
        text: `No se pudo agregar el repuesto: ${error.message}`,
        icon: "error"
      });
    }
  };

  const handleRemoveRepuesto = (id) => {
    setRepuestos(repuestos.filter(r => r.id !== id));
  };

  return (
    <div>
      <Typography variant="h4" className="mb-4">Repuestos</Typography>

      <form onSubmit={handleSubmit(handleAddRepuesto)} className="space-y-4 mb-4">
        <div className="w-full">
          <label htmlFor="producto" className="block text-gray-700">Producto</label>
          <Select
            id="producto"
            name={'producto'}
            register={register}
            rules={{ required: true }}
            isClearable
            options={productos}
            className="w-full"
          />
          {errors.producto && <p className="text-red-500">{errors.producto.message}</p>}
        </div>

        <div className="w-full">
          <label htmlFor="cantidad" className="block text-gray-700">Cantidad</label>
          <Input
            id="cantidad"
            type="number"
            min="1"
            name={'cantidad'}
            register={register}
            rules={{ required: true }}
            
            placeholder="Cantidad"
            className="w-full"
          />
          {errors.cantidad && <p className="text-red-500">{errors.cantidad.message}</p>}
        </div>

        <Button type="submit" color="yellow" variant="contained">
          Agregar
        </Button>
      </form>

      <Typography variant="h5" className="mb-2">Repuestos Agregados</Typography>
      <table className="w-full text-center border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Producto</th>
            <th className="border border-gray-300 p-2">Cantidad</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {repuestos.map(repuesto => (
            <tr key={repuesto.id}>
              <td className="border border-gray-300 p-2">
                {productos.find(p => p.value === repuesto.id_producto)?.label}
              </td>
              <td className="border border-gray-300 p-2">{repuesto.cantidad}</td>
              <td className="border border-gray-300 p-2">
                <Button color="red" onClick={() => handleRemoveRepuesto(repuesto.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};