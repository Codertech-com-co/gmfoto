"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
const API_BASE_URL  = process.env.NEXT_PUBLIC_API_BASE_URL;

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

const Settings = () => {
  const [usuarios, setUsuario] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      let listUser = await getUsuarios();
      setUsuario(listUser);
    };
    loadData();
  }, []);
 //crear usuario con names, lastnames, email, password
 const createUser = () => {
  MySwal.fire({
    title: 'Crear Nuevo Usuario',
    html: `
      <label for="names">Nombres:</label>
      <input type="text" id="names" class="swal2-input">
      <label for="lastnames">Apellidos:</label>
      <input type="text" id="lastnames" class="swal2-input">
      <label for="email">Correo:</label>
      <input type="email" id="email" class="swal2-input" autocomplete='new-password'>
      <label for="password">Clave:</label>
      <input type="password" id="password" class="swal2-input" autocomplete='new-password'>
    `,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: 'Crear',
    preConfirm: () => {
      const names = document.getElementById('names').value;
      const lastnames = document.getElementById('lastnames').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Validaciones adicionales si es necesario

      return { names, lastnames, email, password };
    }
  }).then(async (data) => {
    if (data.isConfirmed) {
      try {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data.value),
          redirect: "follow",
          credentials: "include",
        };
        const response = await fetch(API_BASE_URL + "/auth/register", requestOptions);
        if (!response.ok) {
          const errorData = await response.json();
          throw errorData;
        }
        const result = await response.json();
        // Actualizar la lista de usuarios
        setUsuario([...usuarios, result]);
        MySwal.fire({
          title: 'Usuario creado',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        MySwal.fire({
          title: 'Error al crear usuario',
          text: error.message,
          icon: 'error'
        });
      }
    }
  });
};


  //ELIMINAR USUARIO
  const deleteUser = () => {
    MySwal.fire({
      text: "Desea eliminar este usuario?",
      icon: "question",
      showCancelButton: true,
    }).then((data) => {
      if (data.isConfirmed) {
      }
    });
  };

 //CAMBIAR CONTRASEÑA
 const changePassword = (email) => {
  MySwal.fire({
    title: 'Cambiar Contraseña',
    html: `
    
      <label for="newPassword">Nueva Contraseña:</label>
      <input type="password" id="newPassword" class="swal2-input">
    `,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: 'Cambiar',
    preConfirm: () => {
      // const oldPassword = document.getElementById('oldPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      // Validaciones adicionales si es necesario
      return {  newPassword,email };
    }
  }).then(async (data) => {
    if (data.isConfirmed) {
      try {
        const requestOptions = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data.value),
          redirect: "follow",
          credentials: "include",
        };
        const response = await fetch(API_BASE_URL + `/auth/change-password`, requestOptions);
        if (!response.ok) {
          const errorData = await response.json();
          throw errorData;
        }
        const result = await response.json();
        MySwal.fire({
          title: 'Contraseña actualizada',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        MySwal.fire({
          title: 'Error al actualizar contraseña',
          text: error.message,
          icon: 'error'
        });
      }
    }
  });
};


  return (
    <>
      <Card className="mt-6 w-full shadow-none border-gray-100 ">
        <CardBody>
          <div className="">
            <Typography color="blue-gray" className="relative p-5" variant="h3">
              Configuración
            </Typography>
          </div>

          <div className="p-5 border rounded-xl">
            <Button className="float-end" onClick={() => createUser()}>
              Crear Usuario
            </Button>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              Usuarios
            </Typography>

            <div>
              <table
                className="table-auto text-center w-full mt-10"
                align="center"
              >
                <thead>
                  <tr>
                    <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                      Nombres
                    </th>
                    <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                      Apellidos
                    </th>
                    <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                      Correo
                    </th>
                    <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"></th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((data) => (
                    <tr>
                      <td className="p-4 border-b border-blue-gray-50">
                        <small className="bg-gray-200 p-2 rounded-lg">
                          {data.names}
                        </small>
                      </td>
                      <td className="p-4 border-b border-blue-gray-50">
                        {data.lastnames}
                      </td>
                      <td className="p-4 border-b border-blue-gray-50">
                        {data.email}
                      </td>
                      <td className="p-4 border-b border-blue-gray-50">
                        <Menu>
                          <MenuHandler>
                            <Button>Acciones</Button>
                          </MenuHandler>
                          <MenuList>
                            <MenuItem onClick={() => changePassword(data.email)}>
                              Cambiar Contraseña
                            </MenuItem>
                            {/* <MenuItem
                              className="text-red-600"
                              onClick={() => deleteUser()}
                            >
                              Eliminar
                            </MenuItem> */}
                          </MenuList>
                        </Menu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardBody>
        <CardFooter className="pt-0"></CardFooter>
      </Card>
    </>
  );
};

export default Settings;
