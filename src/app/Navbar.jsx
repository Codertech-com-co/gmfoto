"use client";
import React from "react";
import Image from "next/image";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  Avatar,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Bars4Icon,
  GlobeAmericasIcon,
  NewspaperIcon,
  PhoneIcon,
  RectangleGroupIcon,
  SquaresPlusIcon,
  SunIcon,
  TagIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const navListMenuItems = [
  {
    title: "Clientes",
    description: "Cree, Modifique y Busque",
    icon: UserGroupIcon,
    href: "/clients",
  },
  {
    title: "Ordenes de Servicio",
    description: "Cree, Modifique y Busque",
    icon: NewspaperIcon,
    href: "/orders",
  },
  {
    title: "Equipos Externos",
    description: "Cree, Modifique y Busque",
    icon: RectangleGroupIcon,
    href: "/equipos",
  },
  {
    title: "Inventario",
    description: "Cree, Modifique y Busque",
    icon: SquaresPlusIcon,
    href: "/inventory",
  },
  {
    title: "Comunicación",
    description: "Crea recordatorios y notifica a tus clientes",
    icon: PhoneIcon,
    href: "/communication",
  },
];

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const renderItems = navListMenuItems.map(
    ({ icon, title, description, href }, key) => (
      <Link href={href} key={key}>
        <MenuItem className="flex items-center gap-3 rounded-lg group/item hover:bg-yellow-50">
          <div className="flex items-center justify-center rounded-lg  p-2 group-hover/item:bg-yellow-400  ">
            {" "}
            {React.createElement(icon, {
              strokeWidth: 2,
              className: "h-6 text-gray-900 w-6 ",
            })}
          </div>
          <div className="">
            <Typography
              variant="h6"
              color="blue-gray"
              className="flex items-center text-sm font-bold"
            >
              {title}
            </Typography>
            <Typography
              variant="paragraph"
              className="text-xs !font-medium text-blue-gray-500"
            >
              {description}
            </Typography>
          </div>
        </MenuItem>
      </Link>
    )
  );

  return (
    <React.Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement="bottom"
        allowHover={true}
      >
        <MenuHandler>
          <Typography as="div" variant="small" className="font-medium">
            <ListItem
              className="flex items-center gap-2 py-2 pr-4 font-medium text-gray-900 dark:text-white"
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              Herramientas
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden max-w-screen-xl rounded-xl lg:block">
          <ul className="grid grid-cols-3 gap-y-2 outline-none outline-0">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <div className="block lg:hidden">
        <Collapse open={isMobileMenuOpen}>{renderItems}</Collapse>
      </div>
    </React.Fragment>
  );
}

function NavList() {
  const router = useRouter();
  const cerrarSesion = () => {
    MySwal.fire({
      title: "¿Desea cerrar sesion?",
      icon: "question",
      showCancelButton: true,
    }).then((data) => {
      if (data.isConfirmed) {
        Cookies.remove("auth_token");
        router.push("./login");
      }
    });
  };
  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
      <Typography
        as="a"
        href="#"
        variant="small"
        color="blue-gray"
        className="font-medium"
      >
        {/* <ListItem className="flex items-center gap-2 py-2 pr-4 dark:text-white">
          Inicio
        </ListItem> */}
      </Typography>
      <NavListMenu />
      <Typography
        as="a"
        href="https://api.whatsapp.com"
        target="_blank"
        variant="small"
        color="blue-gray"
        className="font-medium"
      >
        <ListItem
          className="flex items-center gap-2 py-2 pr-4 dark:text-white"
          to="sad"
        >
          Soporte
        </ListItem>
      </Typography>
      <Menu>
        <MenuHandler>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>

          {/* <Avatar src="https://docs.material-tailwind.com/img/face-2.jpg" size="sm" className="cursor-pointer"/> */}
        </MenuHandler>
        <MenuList>
          {/* <MenuItem>Perfil</MenuItem> */}
          <MenuItem
            onClick={() => {
              router.push("./settings");
            }}
          >
            Configuración
          </MenuItem>
          <MenuItem
            className="text-red-600"
            onClick={() => {
              cerrarSesion();
            }}
          >
            Cerrar sesion
          </MenuItem>
        </MenuList>
      </Menu>
    </List>
  );
}

export default function MegaMenuWithHover() {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  return (
    <div className="w-full h-full ">
      <Navbar className="mx-auto max-w-screen-xl px-4 py-2 shadow-none dark:bg-black border-none">
        <div className="flex items-center justify-between text-blue-gray-900 dark:text-white">
          <Typography
            as="a"
            href="/"
            variant="h5"
            className="mr-4 cursor-pointer py-1.5 lg:ml-2"
          >
            <Image
              src={"/images/logo.png"}
              className="dark:invert"
              width={"100"}
              height={"80"}
            />
          </Typography>
          <div className="hidden lg:block">
            <NavList />
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="lg:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
            )}
          </IconButton>
        </div>
        <Collapse open={openNav}>
          <NavList />
        </Collapse>
      </Navbar>
    </div>
  );
}
