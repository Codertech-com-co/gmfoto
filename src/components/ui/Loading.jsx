import { Spinner } from "@material-tailwind/react";
 
export function LoadingPage() {
  return (
    <div className="text-center place-content-center place-items-center h-[70vh]">
  
      <Spinner color="amber" className="h-10 w-10 m-auto" /><br />
      <b className="text-gray-400">Cargando</b>
     
    </div>
  );
}