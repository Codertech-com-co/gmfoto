"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { Typography, Button, Tooltip, Chip, IconButton, ButtonGroup, Input } from "@material-tailwind/react";
import { useState, useEffect, useMemo } from "react";
import { MagnifyingGlassIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const MySwal = withReactContent(Swal);

export default function Inventory() {
    const TABLE_HEAD = ["Marca y Referencia", "Modelo", "Descripción", "Ubicación", "Existencias", ""];

    const [tableRows, setTableRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const ROWS_PER_PAGE = 10;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/productos/all`, {
                    method: "GET",
                    credentials: "include"
                });

                if (response.ok) {
                    const data = await response.json();
                    setTableRows(data);
                } else {
                    console.error("Failed to fetch products:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const totalPages = Math.ceil(tableRows.length / ROWS_PER_PAGE);

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

    const handleDelete = async (idProducto) => {
        const result = await MySwal.fire({
            title: "¿Estás seguro?",
            text: "¡Este producto se eliminará permanentemente!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_BASE_URL}/productos/${idProducto}`, {
                    method: "DELETE",
                    credentials: "include"
                });

                if (response.ok) {
                    MySwal.fire("Eliminado", "El producto ha sido eliminado.", "success");
                    setTableRows(prevRows => prevRows.filter(product => product.id !== idProducto));
                } else {
                    console.error("Failed to delete product:", response.statusText);
                }
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const handleExport = async () => {
        const { value: exportChoice } = await MySwal.fire({
            title: "Exportar Datos",
            text: "¿Quieres exportar los datos de la página actual o de todas las páginas?",
            input: 'radio',
            inputOptions: {
                current: 'Página actual',
                all: 'Todas las páginas'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'Necesitas seleccionar una opción';
                }
            },
            confirmButtonText: 'Exportar',
            cancelButtonText: 'Cancelar',
            showCancelButton: true
        });

        if (exportChoice) {
            let dataToExport = [];
            if (exportChoice === 'current') {
                const paginatedRows = tableRows.slice(
                    (currentPage - 1) * ROWS_PER_PAGE,
                    currentPage * ROWS_PER_PAGE
                );
                dataToExport = paginatedRows;
            } else if (exportChoice === 'all') {
                dataToExport = tableRows;
            }

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
            const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'productos.xlsx');
        }
    };

    const filteredRows = useMemo(() => {
        return tableRows.filter(row =>
            (row.descripcion ? row.descripcion.toLowerCase() : '').includes(searchTerm.toLowerCase()) ||
            (row.marca ? row.marca.toLowerCase() : '').includes(searchTerm.toLowerCase()) ||
            (row.referencia ? row.referencia.toLowerCase() : '').includes(searchTerm.toLowerCase()) ||
            (row.modelo ? row.modelo.toLowerCase() : '').includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, tableRows]);

    const paginatedRows = filteredRows.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <Typography variant="h3" color="blue-gray">
                    Inventario
                </Typography>
                <div className="flex gap-4 col-span-2 md:col-span-1 w-full place-content-end">
                  
                        <Link href={'./inventory/products/create'} className="bg-yellow-200 text-black p-2 text-sm font-bold  hover:bg-yellow-600 content-center border-0 rounded-xl">Crear Producto</Link>
                        <Link href={'./inventory/categories/'} className="bg-yellow-200 text-black p-2 text-sm font-bold  hover:bg-yellow-600 content-center border-0 rounded-xl">Crear Categorías</Link>
                        <Link href={'./inventory/proveedores/'} className="bg-yellow-200 text-black p-2 text-sm font-bold  hover:bg-yellow-600 content-center border-0 rounded-xl">Crear Proveedores</Link>
                        <Link href={'./inventory/transactions'} className="bg-yellow-200 text-black p-2 text-sm font-bold  hover:bg-yellow-600 content-center border-0 rounded-xl">Subir Inventario</Link>
                  
                    <Button className='bg-black text-white p-2 text-sm font-bold  hover:bg-black rounded-xl' onClick={handleExport}>
                        Exportar Datos
                    </Button>
                </div>
            </div>

            <hr className="mt-5 mb-5" />

            <div className="p-5 border-dashed border-2 rounded-lg overflow-auto">
                <div className="mb-4 flex justify-between items-center">
                    <Input
                        label="Busqueda Inteligente"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                       
                        labelProps={{ className: "text-yellow-500" }}
                    />
                </div>

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
                        {paginatedRows.map(({ id, marca, referencia, modelo, descripcion, ubicacion, cantidad_disponible }, index) => {
                            const isLast = index === paginatedRows.length - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={id}>
                                    <td className={classes}>
                                        <div className="flex flex-col">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {marca} - {referencia}
                                            </Typography>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {modelo}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <div className="w-max">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {descripcion}
                                            </Typography>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {ubicacion}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <div className="w-max">
                                            <Chip
                                             variant="ghost"
                                                value={cantidad_disponible}
                                                color={(cantidad_disponible>2)?'green':'red'}
                                                className="font-semibold "
                                            />
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <div className="flex justify-center gap-4">
                                            <Link href={`./inventory/products/${id}`}>
                                                <Tooltip content="Editar">
                                                    <IconButton variant="text" color="blue-gray">
                                                        <PencilIcon className="h-5 w-5 " />
                                                    </IconButton>
                                                </Tooltip>
                                            </Link>
                                            <Tooltip content="Eliminar">
                                                <IconButton
                                                    variant="text"
                                                    color="red"
                                                    onClick={() => handleDelete(id)}
                                                >
                                                    <TrashIcon className="h-5 w-5 text-red-500" />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                
                <div className="mt-4 flex justify-between items-center">
                    <Button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="bg-yellow-500 text-black p-2 text-sm font-bold rounded hover:bg-yellow-600"
                    >
                        Anterior
                    </Button>
                    
                    
                    
                    <Button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="bg-yellow-500 text-black p-2 text-sm font-bold rounded hover:bg-yellow-600"
                    >
                        Siguiente
                    </Button>
                </div>
                <Typography variant="small" color="blue-gray" className="font-semibold mt-5">
                        Página {currentPage} de {totalPages} 
                        <br />
                         Total productos: {filteredRows.length}
                    </Typography>
            </div>
        </>
    );
}
