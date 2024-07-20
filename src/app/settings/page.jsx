"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

const Settings = () => {
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
          <Button className="float-end">Crear Usuario</Button>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              Usuarios
            </Typography>

            <div>
                <table className="table-auto w-full mt-10">
                    <thead>
                        <th   className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">Usuario</th>
                        <th   className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">Rol</th>
                        <th   className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">Acciones</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-4 border-b border-blue-gray-50">Duvan</td>
                            <td className="p-4 border-b border-blue-gray-50">ADMIN</td>
                            <td className="p-4 border-b border-blue-gray-50"></td>
                        </tr>
                    </tbody>


                </table>
            </div>
            
            
          </div>
        </CardBody>
        <CardFooter className="pt-0">
       
        </CardFooter>
      </Card>
    </>
  );
};

export default Settings;
