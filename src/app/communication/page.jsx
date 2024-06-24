"use client"
import React, { useMemo, useState } from 'react';
import Select from "../../components/ui/Select"
import Textarea from "../../components/ui/Textarea"
import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
    Breadcrumbs,
    Switch,
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


export function SortableTable() {


    return (
        <>
            <Breadcrumbs>
                <Link href="/" className="opacity-60 hover:text-yellow-900">
                    Home
                </Link>
                <button className="opacity-60" disabled>
                    Comunicación
                </button>
            </Breadcrumbs>

            <Card className="h-full w-full m-auto mt-5 shadow-none border-2 border-dashed p-5">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-8 flex items-center justify-between gap-8">
                        <div>
                            <Typography variant="h5" color="blue-gray">
                                Comunicación
                            </Typography>

                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">

                            {/* <Link href={"clients/create"} className="flex items-center gap-3 bg-yellow-500 rounded-lg p-2 text-black text-sm" size="sm">
                            <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Crear Nuevo
                        </Link> */}
                        </div>
                    </div>



                    {/* <Button variant='outlined' className='border-yellow-500 text-balnk' size='sm'>Exportar Datos</Button> */}
                </CardHeader>
                <CardBody className="overflow-auto px-0">



                    <Card className=" w-full bg-gray-50 shadow-none">
                        <CardBody>
                            <Typography variant="h5" color="blue-gray" className="mb-2  w-full">
                                < Switch color='yellow' className='mr-2' /> Recordatorios por Email <b className='text-sm'>Automatico</b>
                            </Typography>
                            <Typography>

                                <div className='grid grid-cols-2 gap-4'>
                                    <div>

                                        <small>Permitir que tus clientes reciban un recordatorio de mantenimeinto de 6 meses</small>
                                        <br />
                                        <Button className='p-2 m-2' color='yellow'>Adicionar Horario</Button>

                                        <div className='flex mt-1'>
                                            <div>

                                                <Input
                                                    label='Dias antes'
                                                    type='number' />
                                            </div>
                                            <div className='ml-3'>

                                                <Input
                                                    label='Hora'
                                                    type='time' />
                                            </div>

                                        </div>
                                    </div>
                                    <div>
                                        <Textarea
                                            label={'Mensaje'}
                                        />
                                        <Button className='float-end' color='yellow'>Guardar</Button>
                                    </div>

                                </div>

                            </Typography>
                        </CardBody>
                        <CardFooter className="pt-0">

                        </CardFooter>
                    </Card>

                </CardBody>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">

                </CardFooter>
            </Card>
        </>
    );
}

export default SortableTable;
