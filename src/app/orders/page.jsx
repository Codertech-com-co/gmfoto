"use client"
import React, { useMemo, useState } from 'react';
import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon, DocumentIcon } from "@heroicons/react/24/solid";
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


import { Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';


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

const TABLE_HEAD = ["Consecutivo", "Etapa", "Tipo", "Cliente", "Fecha Creacion", "Creado por", ""];

const TABLE_ROWS = [
    {
        Consecutivo: "1",
        name: "John Michael",
        email: "john@creative-tim.com",
        job: "Manager",
        org: "Organization",
        online: true,
        date: "23/04/18",
        date: "23/04/18",
    }
];

const ROWS_PER_PAGE = 10;

// const PdfModal = ({ open, handleOpen }) => {
//     return (
//         <Dialog open={open} handler={handleOpen} size="xl">
//             {/* <DialogHeader>Vista Previa del PDF</DialogHeader> */}
//             <DialogBody divider>
//                 <PDFViewer width="100%" height="500">
//                     <MyDocument />
//                 </PDFViewer>
//             </DialogBody>
//             <DialogFooter>
//                 <Button color="red" onClick={handleOpen} ripple="dark">
//                     Cerrar
//                 </Button>
//             </DialogFooter>
//         </Dialog>
//     );
// };

export function SortableTable() {

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [status, setStatus] = useState('all');
    const totalPages = useMemo(() => Math.ceil(TABLE_ROWS.length / ROWS_PER_PAGE), []);

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
            Cliente: 'name',
            Empresa: 'org',
            Status: 'online',
            Creado: 'date',
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
                value.toString().toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search]);

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
        console.log(value.toString())
        setStatus(value.toString());
    };


    const paginatedRows = useMemo(() => {
        setLoading(true);
        const filteredByStatus = status === 'all' ? sortedRows : sortedRows.filter(row => row.online.toString() === status);
        setLoading(false);
        return filteredByStatus.slice(
            (currentPage - 1) * ROWS_PER_PAGE,
            currentPage * ROWS_PER_PAGE
        );
    }, [sortedRows, currentPage, status]);

    if (loading) {
        return <LoadingPage />;
    }


    return (
        <Card className="h-full w-full m-auto mt-5 shadow-none border-2 border-dashed p-5 dark:bg-black dark:border-gray-700">
            <CardHeader floated={false} shadow={false} className="rounded-none dark:bg-black">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray" className='dark:text-white'>
                            Ordenes de Servicio
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal dark:text-white">
                            Ver información sobre todas las ordenes de servicio
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        {/* <Button variant="outlined" size="sm">
                            view all
                        </Button> */}
                        <Link href={"orders/create"} className="flex items-center gap-3 bg-yellow-500 rounded-lg p-2 text-black text-sm" size="sm">
                            <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Crear Orden
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
                <Button variant='outlined' className='border-yellow-500 text-balnk dark:text-white' size='sm'>Exportar Datos</Button>
            </CardHeader>
            <CardBody className="overflow-auto px-0">
                <table className="mt-4 w-full min-w-max table-auto text-left dark:border-gray-700">
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
                                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 dark:text-white"
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
                            ({ Consecutivo, name, email, job, org, online, date }, index) => {
                                const isLast = index === paginatedRows.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-blue-gray-50";

                                return (
                                    <tr key={name}>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                               
                                                <div className="flex flex-col">
                                                    
                                                    <Tooltip content="Editar Orden">
                                                        <Link
                                                        href={'orders/1'}
                                                            variant="small"
                                                            
                                                            className="font-normal opacity-70 text-yellow-800 border-b-2 dark:text-white"
                                                        >
                                                            OS-{Consecutivo}
                                                        </Link>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal dark:text-white"
                                                >
                                                    {job}
                                                </Typography>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal opacity-70 dark:text-white"
                                                >
                                                    {org}
                                                </Typography>
                                            </div>
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
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal dark:text-white"
                                            >
                                                {date}
                                            </Typography>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td className={classes}>
                                            <Tooltip content="Generar impresion">
                                                <Link
                                                href={'orders/1/document'}>
                                                <IconButton variant="text">
                                                    <DocumentIcon className="h-4 w-4 dark:text-white" />
                                                </IconButton>
                                                </Link>
                                               
                                            </Tooltip>
                                            
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal dark:text-white">
                    Pagina {currentPage} de {totalPages}
                </Typography>
                <div className="flex gap-2">
                    <Button variant="outlined" className='border-yellow-500 dark:text-white' size="sm" onClick={handlePreviousPage}>
                        Anteriror
                    </Button>
                    <Button className='bg-yellow-500 text-black ' size="sm" onClick={handleNextPage}>
                        Siguiente
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

export default SortableTable;
