"use client";
const API_BASE_URL  = process.env.NEXT_PUBLIC_API_BASE_URL;
import React, { useMemo, useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import formatDateTime from "../../../libs/formatDateTime";
import withReactContent from "sweetalert2-react-content";
import {
  PencilIcon,
  UserPlusIcon,
  DocumentIcon ,
  CalendarIcon
} from "@heroicons/react/24/solid";
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
import Link from "next/link";
import { LoadingPage } from "@/components/ui/Loading";
import { fetchOrders } from "../../utils/api/orders";

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

const TABLE_HEAD = [
  "",
  "Consecutivo",
  "Etapa",
  "Tipo",
  "Cliente",
  "Fecha Creacion",
  "Creado por",
  
];

const ROWS_PER_PAGE = 10;

export function SortableTable() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [TABLE_ROWS, setTableRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [status, setStatus] = useState("all");

  const totalPages = useMemo(
    () => Math.ceil(TABLE_ROWS.length / ROWS_PER_PAGE),
    [TABLE_ROWS.length]
  );

  const handleOpen = () => setOpen(!open);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      const dataTable = data.map((client) => ({
        id: client.id_order,
        no_order: client.no_order,
        etapa: client.etapa,
        tipo: client.tipo,
        razonSocial: client.razonSocial,
        usuario_creado: client.usuario_creado,
        fecha_creacion: client.fecha_creacion,
      }));
      setTableRows(dataTable);
      setLoading(false);

      // MySwal.fire({
      //   title: "Lista actualizada",
      //   icon: "success",
      //   toast: true,
      //   position: "bottom",
      //   showConfirmButton: false,
      //   timer: 3000,
      //   timerProgressBar: false,
      // });
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      id: "id_order",
    };

    const mappedColumn = columnMapping[column];

    if (mappedColumn === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(mappedColumn);
      setSortDirection("asc");
    }
  };

  const filteredRows = useMemo(() => {
    return TABLE_ROWS.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [TABLE_ROWS, search]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      if (sortColumn !== "") {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];
        if (sortDirection === "asc") {
          return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
          return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
      }
      return 0;
    });
  }, [filteredRows, sortColumn, sortDirection]);

  const handleStatus = (value) => {
    console.log(value.toString());
    setStatus(value.toString());
  };

  const paginatedRows = useMemo(() => {
    setLoading(true);
    const filteredByStatus = sortedRows.filter(
      (row) => status === "all" || row.online.toString() === status
    );
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
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none dark:bg-black"
      >
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography
              variant="h5"
              color="blue-gray"
              className="dark:text-white"
            >
              Ordenes de Servicio
            </Typography>
            <Typography
              color="gray"
              className="mt-1 font-normal dark:text-white"
            >
              Ver información sobre todas las ordenes de servicio
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Link
              href={"orders/create"}
              className="flex items-center gap-3 bg-black rounded-lg p-2 text-white text-sm"
              size="sm"
            >
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Crear Orden
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full md:w-72">
            <Input
              label="Busqueda Inteligente"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              onChange={handleSearch}
            />
          </div>
        </div>
        <br />
        {/* <Button
          variant="outlined"
          className="border-yellow-500 text-balnk dark:text-white"
          size="sm"
        >
          Exportar Datos
        </Button> */}
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
            {paginatedRows.map(({ id, no_order,etapa, tipo, razonSocial,usuario_creado,fecha_creacion }, index) => {
              const isLast = index === paginatedRows.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={id}>
                   <td className={classes}>
                    <Tooltip content="Generar impresion">
                      <Link href={"orders/" + id + "/document"}>
                        <IconButton variant="text">
                          <DocumentIcon className="h-4 w-4 dark:text-white text-yellow-900" />
                        </IconButton>
                      </Link>
                    </Tooltip>
                  </td>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <Tooltip content="Editar Orden">
                          <Link
                            href={"orders/" + id}
                            variant="small"
                            className="font-normal opacity-70 text-yellow-800 border-b-2 dark:text-white bg-yellow-100 p-2 rounded-xl text-center"
                          >
                            OS-{no_order}
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
                        {etapa.toUpperCase().replace(/_/g," ")}
                      </Typography>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal opacity-70 dark:text-white"
                      ></Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="w-max">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal dark:text-white"
                      >
                        {tipo.toUpperCase().replace(/_/g," ")}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal dark:text-white bg-gray-200 p-1 rounded-xl text-center"
                    >
                      {razonSocial}
                    </Typography>
                  </td>
                  <td>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal dark:text-white bg-gray-200 p-1 rounded-xl text-center"
                    >{formatDateTime(fecha_creacion)} </Typography>
                  </td>
                  <td>
                  <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal dark:text-white bg-gray-200 p-1 rounded-xl text-center"
                    >{usuario_creado.toUpperCase()}</Typography>
                  </td>
                 
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal dark:text-white"
        >
          Pagina {currentPage} de {totalPages}
          <br />
          Total registros {filteredRows.length}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            className="border-yellow-500 dark:text-white"
            size="sm"
            onClick={handlePreviousPage}
          >
            Anterior
          </Button>
          <Button
            className="bg-yellow-500 text-black "
            size="sm"
            onClick={handleNextPage}
          >
            Siguiente
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default SortableTable;
