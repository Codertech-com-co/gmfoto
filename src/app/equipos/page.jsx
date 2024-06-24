"use client"
import React, { useMemo, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";
import Link from 'next/link';
import { LoadingPage } from '@/components/ui/Loading';
import { fetchEquipos } from '../../utils/api/equipos';

   

const MySwal = withReactContent(Swal);
const TABS = [
    {
        label: "Todos",
        value: "all",
    },
    {
        label: "Online",
        value: true,
    },
    {
        label: "Offline",
        value: false,
    },
];

const TABLE_HEAD = ["Referencia", "Descripción", "Serial", "Marca", "Fecha Factura", "Creado por", "Modificado por"];

const ROWS_PER_PAGE = 10;

export function SortableTable() {

   
    

    const [loading, setLoading] = useState(true);
    const [TABLE_ROWS, setTableRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [status, setStatus] = useState('all');

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await fetchEquipos();
            const dataTable = data.map(client => ({
                id: client.id,
                referencia: client.referencia,
                descripcion: client.descripcion,
                serial: client.serial,
                marca: client.marca,
                fechaFactura: client.fecha_factura,
                creadoPor: client.creadoPor,
                modificadoPor: client.modificadoPor,
                online: client.online,  // Supongo que hay un campo para el estado online/offline
            }));
            setTableRows(dataTable);
            setLoading(false);

            MySwal.fire({
                title: "Lista actualizada",
                icon: "success",
                toast: true,
                position: "bottom",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: false,
            })
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalPages = useMemo(() => Math.ceil(TABLE_ROWS.length / ROWS_PER_PAGE), [TABLE_ROWS]);

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

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleSort = (column) => {
        const columnMapping = {
            "Referencia": 'referencia',
            "Descripción": 'descripcion',
            "Serial": 'serial',
            "Marca": 'marca',
            "Fecha Factura": 'fechaFactura',
            "Creado por": 'creadoPor',
            "Modificado por": 'modificadoPor',
        };

        const mappedColumn = columnMapping[column];

        if (mappedColumn === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(mappedColumn);
            setSortDirection('asc');
        }
    };

    const filteredRows = useMemo(() => {
        return TABLE_ROWS.filter((row) =>
            Object.values(row).some((value) =>
                (value?.toString() ?? '').toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, TABLE_ROWS]);

    const sortedRows = useMemo(() => {
        return [...filteredRows].sort((a, b) => {
            if (sortColumn !== '') {
                const valueA = a[sortColumn];
                const valueB = b[sortColumn];
                if (sortDirection === 'asc') {
                    return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
                } else {
                    return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
                }
            }
            return 0;
        });
    }, [filteredRows, sortColumn, sortDirection]);

    const handleStatus = (value) => {
        setStatus(value.toString());
    };

    const paginatedRows = useMemo(() => {
        const filteredByStatus = status === 'all' ? sortedRows : sortedRows.filter(row => row.online.toString() === status);
        return filteredByStatus.slice(
            (currentPage - 1) * ROWS_PER_PAGE,
            currentPage * ROWS_PER_PAGE
        );
    }, [sortedRows, currentPage, status]);

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <Card className="h-full w-full m-auto mt-5 shadow-none border-2 border-dashed p-5">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Lista de Equipos
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            Ver información sobre todos los equipos externos
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Link href={"equipos/create"} className="flex items-center gap-3 bg-yellow-500 rounded-lg p-2 text-black text-sm" size="sm">
                            <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Crear Nuevo
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <Tabs value="all" className="w-full md:w-max">
                        <TabsHeader>
                            {TABS.map(({ label, value }) => (
                                <Tab key={value} value={value} className='' onClick={() => handleStatus(value)}>
                                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                </Tab>
                            ))}
                        </TabsHeader>
                    </Tabs>
                    <div className="w-full md:w-72">
                        <Input
                            label="Busqueda Inteligente"
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <br />
                <Button variant='outlined' className='border-yellow-500 text-black' size='sm'>Exportar Datos</Button>
            </CardHeader>
            <CardBody className="overflow-auto px-0">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head, index) => (
                                <th
                                    key={head}
                                    onClick={() => handleSort(head)}
                                    className="cursor-pointer border-y border-blue-gray-100  p-4 transition-colors hover:bg-blue-gray-50"
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
                            ({ id, referencia, descripcion, serial, marca, fechaFactura, creadoPor, modificadoPor, online }, index) => {
                                const isLast = index === paginatedRows.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-blue-gray-50";

                                return (
                                    <tr key={id}>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <Typography

                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal opacity-70"
                                                >
                                                    {referencia}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {descripcion}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Link href={`./equipos/${encodeURIComponent(id)}` } className='text-yellow-700'>
                                                <Typography
                                                    variant="small"
                                                    // color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {serial}
                                                </Typography>
                                            </Link>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {marca}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {fechaFactura}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {creadoPor}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {modificadoPor}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <div className="w-max">
                                                <Chip
                                                    variant="ghost"
                                                    size="sm"
                                                    value={online ? "online" : "offline"}
                                                    color={online ? "green" : "blue-gray"}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Pagina {currentPage} de {totalPages}
                </Typography>
                <div className="flex gap-2">
                    <Button variant="outlined" className='border-yellow-500' size="sm" onClick={handlePreviousPage}>
                        Anterior
                    </Button>
                    <Button className='bg-yellow-500 text-black' size="sm" onClick={handleNextPage}>
                        Siguiente
                    </Button>
                </div>
            </CardFooter>



        </Card>
    );
}

export default SortableTable;
