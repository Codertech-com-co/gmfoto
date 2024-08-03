"use client";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Input from "../../../components/ui/Input";
import { Button } from "@material-tailwind/react";
import { Breadcrumbs } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

const MySwal = withReactContent(Swal);

const fetchClientData = async (clientId) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, requestOptions);
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
    credentials: "include",
  };

  try {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, requestOptions);
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    const result = await response.json();
    return result;
  } catch (error) {
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
    const response = await fetch(`${API_BASE_URL}/clients/`, requestOptions);
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

const fetchDepartmentsAndCities = async () => {
  const response = await fetch("https://datos.gov.co/resource/xdk5-pm3f.json");
  const data = await response.json();
  return data;
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
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [departmentsWithCities, setDepartmentsWithCities] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("Colombia");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCity, setSelectedCity] = useState(""); // Added state for selectedCity
  const clientId = params.id;
  const router = useRouter();

  useEffect(() => {
    const loadClientData = async () => {
      if (clientId !== "create") {
        const clientData = await fetchClientData(clientId);
        setClient(clientData);
        reset(clientData);

        if (clientData.pais === "Colombia") {
          setSelectedCountry("Colombia");
          setSelectedDepartment(clientData.departamento);
          setSelectedCity(clientData.ciudad); // Set selectedCity
          setValue("ciudad", clientData.ciudad);
        } else {
          setSelectedCountry("Otro");
        }
      }
    };

    loadClientData();
  }, [clientId, reset, setValue]);

  useEffect(() => {
    const loadDepartmentsAndCities = async () => {
      const data = await fetchDepartmentsAndCities();
      const departmentsWithCities = data.reduce((acc, item) => {
        if (!acc[item.departamento]) {
          acc[item.departamento] = [];
        }
        acc[item.departamento].push(item.municipio);
        return acc;
      }, {});
      setDepartmentsWithCities(departmentsWithCities);
      setDepartments(Object.keys(departmentsWithCities));
    };

    loadDepartmentsAndCities();
  }, []);

  useEffect(() => {
    if (selectedCountry === "Colombia" && selectedDepartment) {
      setCities(departmentsWithCities[selectedDepartment] || []);
    } else {
      setCities([]);
    }
  }, [selectedDepartment, selectedCountry, departmentsWithCities]);

  const onSubmit = async (data) => {
    try {
      if (clientId === "create") {
        await insertClientData(data);
      } else {
        await updateClientData(clientId, data);
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
        router.push("/clients");
      }, 500);
    } catch (error) {
      // console.log(error)
      MySwal.fire({
        title: "Error guardando datos: " + error.description,
        icon: "error",
        toast: true,
        position: "bottom",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: false,
      });
    }
  };

  const validarDocumento = async (e) => {
    const documento = e.target.value;

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      credentials: "include",
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/clients/verificarDocument/` + documento,
        requestOptions
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      const result = await response.json();
    } catch (error) {
      MySwal.fire({
        title:"Error",
        icon:"error",
        text:error.message
      })
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
      <small className="text-black">
        Complete el siguiente formulario para este cliente
      </small>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-dashed rounded-lg border-2 bg-white"
      >
        <b className="text-black col-span-2">Datos Empresa</b>
        <Input
          label="Identificación"
          name="documento"
          register={register}
          rules={{ required: true }}
          errors={errors}
          onBlur={validarDocumento}
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
          rules={{ required: true }}
          register={register}
          errors={errors}
        />
        <Input
          label="Teléfono"
          name="telefonoEstablecimiento"
          register={register}
          rules={{ required: true }}
          errors={errors}
        />
        <Input
          label="Correo Electrónico"
          name="email"
          register={register}
          
          rules={{
            required:true,
            pattern: {
              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
              message: "Email no válido",
            },
          }}
          errors={errors}
        />
        <Input
          label="Propietario"
          name="propietario"
          rules={{ required: true }}
          register={register}
          errors={errors}
        />
        <Input
          label="Dirección"
          name="direccion"
          rules={{ required: true }}
          register={register}
          errors={errors}
        />
        <select
          {...register("pais")}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedDepartment("");
            setSelectedCity(""); // Clear selectedCity
            setValue("departamento", "");
            setValue("ciudad", "");
          }}
          className="p-2 border border-gray-300 rounded col-span-2"
        >
          <option value="Colombia">Colombia</option>
          <option value="Otro">Otro</option>
        </select>
        {selectedCountry === "Colombia" && (
          <>
            <select
              {...register("departamento")}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setSelectedCity(""); // Clear selectedCity
                setValue("ciudad", "");
              }}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Seleccione un departamento</option>
              {departments.map((department, index) => (
                <option key={index} value={department}>
                  {department}
                </option>
              ))}
            </select>
            <select
              {...register("ciudad")}
              onChange={(e) => {
                setSelectedCity(e.target.value); // Update selectedCity
              }}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Seleccione una ciudad</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <input
              type="hidden"
              {...register("departamento_id")}
              value={selectedDepartment}
            />
            <input
              type="hidden"
              {...register("ciudad_id")}
              value={selectedCity}
            />
          </>
        )}
        {selectedCountry !== "Colombia" && (
          <>
            <Input
              label="Departamento"
              name="departamento"
              register={register}
              errors={errors}
            />
            <Input
              label="Ciudad"
              name="ciudad"
              register={register}
              errors={errors}
            />
          </>
        )}
        {/* <Input
          label="Celular"
          name="celularPropietario"
          register={register}
          errors={errors}
        /> */}
        <Input
          label="Página Web"
          name="paginaWeb"
          register={register}
          errors={errors}
        />
        <input
          type="hidden"
          {...register('tipoGestion')}
        />
        <b className="text-black col-span-2">Datos de Contacto</b>
        <Input
          label="Nombre persona de Contacto"
          name="nombrePersonaContacto"
          register={register}
          rules={{ required: true }}
          errors={errors}
        />
        <Input
          label="Celular Contacto"
          name="celularPersonaContacto"
          register={register}
          rules={{ required: true }}
          errors={errors}
        />
        <div className="w-full flex justify-end mt-4 col-span-2">
          <Link
          href={'/clients'}
            
            className="bg-white font-bold text-gray-800 hover:bg-white p-2 rounded-lg mr-2"
          >
            Cancelar
          </Link>
          <Button
            type="submit"
            className="bg-black text-white hover:bg-black"
          >
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
}
