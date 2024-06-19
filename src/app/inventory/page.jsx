"use client"
import { Typography, Button, Avatar, Tooltip, Chip, IconButton } from "@material-tailwind/react"
import { useState } from "react";
import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon,ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";

export default () => {


    const TABLE_HEAD = ["Marca y Referencia", "Modelo", "Descripcion", "Ubicación", "Existencias", ""];

    const TABLE_ROWS = [
        {
            img: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Nikon_Logo.svg",
            brand: "NIKON",
            reference: "002'KV81'100",
            model: "L320",
            description: "Main Pcb W/Battery",
            online: true,
            ubication: "K03A",
            stock: 20
        }
        // Agrega más filas según sea necesario
    ];

    const ROWS_PER_PAGE = 10;

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(TABLE_ROWS.length / ROWS_PER_PAGE);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const paginatedRows = TABLE_ROWS.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <Typography variant="h3" color="blue-gray">
                    Inventario
                </Typography>
                <div className="flex  gap-4 col-span-2 md:col-span-1 w-full place-content-end" >
                    <Button className="bg-yellow-500 text-black">Crear Producto</Button>
                    <Button variant="outlined" className="border-yellow-500">Subir Inventario</Button>
                </div>
            </div>

            <hr className="mt-5 mb-5" />

            <div className="p-5 border-dashed border-2 rounded-lg overflow-auto">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head, index) => (
                                <th
                                    key={head}
                                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                    >
                                        {head}{" "}
                                        {index !== TABLE_HEAD.length - 1 && (
                                            <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                        )}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedRows.map(
                            ({ img, brand, reference, model, description, ubication, stock }, index) => {
                                const isLast = index === paginatedRows.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-blue-gray-50";

                                return (
                                    <tr key={reference}>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <Avatar src={img} alt={brand} size="sm" />
                                                <div className="flex flex-col">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {brand}
                                                    </Typography>

                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal opacity-70"
                                                    >
                                                        {reference}
                                                    </Typography>

                                                </div>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {model}
                                                </Typography>


                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="w-max">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {description}
                                                </Typography>


                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {ubication}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <div className="w-max m-auto">
                                                <Chip
                                                    variant="ghost"
                                                    size="lg"
                                                    value={stock}
                                                    color={stock > 4 ? "green" : "red"}
                                                />
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Tooltip content="Inspeccionar">
                                                <IconButton size="sm" className="bg-yellow-500 text-black">
                                                    <ClipboardDocumentCheckIcon className="h-4 w-4" />
                                                </IconButton>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between border-t border-blue-gray-50 p-4">
            <Typography variant="small" color="blue-gray" className="font-normal">
                    Pagina {currentPage} de {totalPages}
                </Typography>
                <div className="flex gap-2">
                <Button variant="outlined" className='border-yellow-500' size="sm" onClick={handlePreviousPage}>
                        Anteriror
                    </Button>
                    <Button className='bg-yellow-500 text-black' size="sm" onClick={handleNextPage}>
                        Siguiente
                    </Button>
                </div>
            </div>

        </>
    )
}