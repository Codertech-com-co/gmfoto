"use client"
import {
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Card,
  CardBody,
  Typography
} from "@material-tailwind/react";

export default function MegaMenuWithHover() {


  return (
    <div className="w-full h-full">
      <div className="bg-white w-full md:w-[80%] m-auto mt-5 p-5">
        <Typography color="blue-gray" variant="h3">Bienvenido a tu CRM, Duvan</Typography>

        <Card className="w-96 overflow-hidden rounded-md mt-5">
          <CardBody>
            <Typography color="blue-gray" variant="h5">Agenda para hoy</Typography>

            <List className="my-2 p-0">
              <ListItem className="group rounded-xl py-1.5 px-3 text-md font-normal text-blue-gray-700 hover:bg-yellow-500 hover:text-black focus:bg-yellow-500 focus:text-black">

                Equipo NIKON 56442

              </ListItem>

            </List>
          </CardBody>


        </Card>
      </div>
    </div>
  );
}
