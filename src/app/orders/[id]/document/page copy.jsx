"use client";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import datetimeToDate from "../../../../../libs/datetimeToDate";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { Breadcrumbs, Button } from "@material-tailwind/react";
import dynamic from "next/dynamic";
import Link from "next/link";
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

// Registrar la fuente con negrita
Font.register({
  family: "Poppins",
  fonts: [
    { src: "/fonts/Poppins-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/Poppins-Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/Poppins-Italic.ttf", fontWeight: "italic" },
    { src: "/fonts/Poppins-BoldItalic.ttf", fontWeight: "bolditalic" },
    { src: "/fonts/Poppins-Light.ttf", fontWeight: "light" },
    { src: "/fonts/Poppins-LightItalic.ttf", fontWeight: "lightitalic" },
    { src: "/fonts/Poppins-Medium.ttf", fontWeight: "medium" },
    { src: "/fonts/Poppins-MediumItalic.ttf", fontWeight: "mediumitalic" },
    { src: "/fonts/Poppins-SemiBold.ttf", fontWeight: "semibold" },
    { src: "/fonts/Poppins-SemiBoldItalic.ttf", fontWeight: "semibolditalic" },
    { src: "/fonts/Poppins-Thin.ttf", fontWeight: "thin" },
    { src: "/fonts/Poppins-ThinItalic.ttf", fontWeight: "thinitalic" },
  ],
});
// Create styles
const styles = StyleSheet.create({
  page: {
    // fontFamily: 'Arial',
    fontFamily: "Poppins",
    fontSize: 12,
    padding: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  logo: {
    width: 50,
    height: "auto",
  },
  headerText: {
    fontSize: 8,
    fontWeight: 600,
  },
  section: {
    marginBottom: 10,
    padding: 8,
    border: "1px solid #c0c0c0",
    borderStyle: "dashed",
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  column: {
    display: "flex",
  },
  label: {
    fontSize: 8,
    marginLeft: 5,
    backgroundColor:""
  },
  bold: {
    fontSize: 8,
    fontWeight: "bold",
    marginLeft: 5,
  },
  input: {
    fontSize: 7,
    borderStyle: "dashed",
    border: "1px solid #c0c0c0",
    padding: 3,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  textArea: {
    borderStyle: "dashed",
    border: "1px solid #c0c0c0",
    flex: 1,
    padding: 3,
    minHeight: 35,
    borderRadius: 10,
    fontSize: 7,
    marginLeft: 5,
  },
});

const fetchClientData = async (idEquipo) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const response = await fetch(
    `${API_BASE_URL}/orders/${idEquipo}`,
    requestOptions
  );
  const result = await response.json();
  return result[0];
};

// Create Document Component
function MyDocument(props) {
  const id = props.params.id;
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadClientData = async () => {
      const clientData = await fetchClientData(id);
      setData(clientData);
    };

    loadClientData();
  }, [id]);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Breadcrumbs>
        <Link href="/orders" className="opacity-60 hover:text-yellow-900">
          Lista Ordenes
        </Link>
        <button className="opacity-60" disabled>
          Documento Orden {id}
        </button>
      </Breadcrumbs>
      <br />
      <PDFViewer width="100%" height="600">
        <Document title={id} author="CoderTech">
          <Page size="Legal" style={styles.page}>
            <Header data={data} />
            <CustomerInfo data={data} />
            <ProductInfo data={data} />
            <ServiceInfo data={data} />
            <Authorization data={data} />
            <Text style={{ textAlign: "center", fontSize: 8 }}>
              SOLO PRESTAMOS SERVICIO DE GARANTIAS PARA MN FOTO SAS Y/O SH
              AMERICAS
            </Text>
          </Page>
        </Document>
      </PDFViewer>
      <div className="mt-5">
        {/* <Button color='yellow'>Enviar a Email</Button> */}
      </div>
    </>
  );
}

const Header = (data) => {
  return (
    <>
      <View style={styles.header}>
        <View>
          <Image
            style={styles.logo}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Nikon_Logo.svg/512px-Nikon_Logo.svg.png"
            alt="Company Logo"
          />
          <Text style={{ fontSize: 10, fontWeight: "bold", marginTop: 8 }}>
            ORDEN DE SERVICIO No. <Text style={{ color: "red" }}>5</Text>
          </Text>
        </View>

        <View style={{ flexDirection: "row", textAlign: "right" }}>
          <View>
            <Image
              style={{ width: 60, height: "auto", marginLeft: 25 }}
              src="/images/logo.png"
              alt="Company Logo"
            />
          </View>

          <View style={{ fontSize: 8, marginLeft: 25 }}>
            <Text>GM FOTO SAS</Text>
            <Text>NIT 80016783</Text>
            <Text>CENTRO DE SERVICIO</Text>
            <Text>AUTOIZADO NIKON</Text>
          </View>
        </View>
      </View>
      <View>
        <View style={{ fontSize: 4, textAlign: "center", marginBottom: 5 }}>
          <Text style={styles.headerText}>SERVICIO TÉCNICO AUTORIZADO</Text>
          <Text style={styles.headerText}>
            WhatsApp: 316 7432951 - 318 6085419
          </Text>
          <Text style={styles.headerText}>
            e-mail: german.gonzalez@gmfoto.com.co
          </Text>
        </View>
      </View>
    </>
  );
};

const CustomerInfo = (data) => {
  data = data.data;
  return (
    <View style={styles.section}>
      <Text style={styles.label}>DATOS DEL CLIENTE</Text>
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.input}>{data.razonSocial}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Documento de Identidad N°:</Text>
          <Text style={styles.input}>{data.documento}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Dirección:</Text>
          <Text style={styles.input}>{data.direccion}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Ciudad:</Text>
          <Text style={styles.input}>{data.ciudad}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Teléfono fijo:</Text>
          <Text style={styles.input}>12546</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Celular:</Text>
          <Text style={styles.input}>{data.telefonoEstablecimiento}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Correo electronico:</Text>
          <Text style={styles.input}>{data.telefonoEstablecimiento}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Guia de Envio:</Text>
          <Text style={styles.input}>{data.guia}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Transportadora:</Text>
          <Text style={styles.input}>{data.transportadora}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Fecha de Envio:</Text>
          <Text style={styles.input}>{data.fecha_cierre || ""}</Text>
        </View>
      </View>
    </View>
  );
};

const ProductInfo = (data) => {
  data = data.data;
  const estado = JSON.parse(data.estado_del_producto);
  console.log(estado);

  return (
    <View style={styles.section}>
      <Text style={styles.label}>DATOS DEL PRODUCTO</Text>
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Marca:</Text>
          <Text style={styles.input}>{data.marca}</Text>
        </View>
        {/* <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Text style={styles.label}>Modelo:</Text>
          <Text style={styles.input}>ENVIA</Text>
        </View> */}
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Serial:</Text>
          <Text style={styles.input}>{data.serial}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Modelo:</Text>
          <Text style={styles.input}>{data.descripcion}</Text>
        </View>
        {/* <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Text style={styles.label}>Modelo:</Text>
          <Text style={styles.input}>ENVIA</Text>
        </View> */}
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Referencia:</Text>
          <Text style={styles.input}>{data.referencia}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Accesorios:</Text>
          <Text style={styles.textArea}>{data.accesorios}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Daño reportado:</Text>
          <Text style={styles.input}>{data.falla_reportada}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Estado del producto:</Text>
          <Text style={styles.input}>
            {estado.map((key) => (
              <Text key={key}>{key.replace(/_/g, " ")}, </Text>
            ))}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Fecha de compra:</Text>
          <Text style={styles.input}>{datetimeToDate(data.fecha_factura)}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Equipo con garantia:</Text>
          <Text style={styles.input}>
            {data.tipo.toUpperCase().replace(/_/g, " ")}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Numero de la factura:</Text>
          <Text style={styles.input}>{data.no_factura}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Persona que recibe el producto:</Text>
          <Text style={styles.input}>{data.persona_que_recibe_nombre}</Text>
        </View>
      </View>
    </View>
  );
};

const ServiceInfo = (data) => {
  data = data.data;
  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <Text style={styles.label}>INFORMACIÓN SERVICIO TÉCNICO</Text>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Técnico Asignado</Text>
          <Text style={styles.input}>{data.labores[(data.labores.length >0)?data.labores.length -1:0].names+ " "+data.labores[(data.labores.length >0)?data.labores.length -1:0].lastnames}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Diagnostico:</Text>
          <Text style={styles.textArea}>{data.diagnostico}</Text>
        </View>
      </View>
      <Text
        style={{
          fontWeight: 600,
          textAlign: "center",
          marginTop: 10,
          fontSize: 8,
          marginBottom: 8,
        }}
      >
        TODOS LOS EQUIPOS ESTAN SUJETOS A UN NUEVO DIAGNOSTICO Y CAMBIO EN EL
        COSTO DE LA REPARACION, ESTE PUEDE AUMENTAR DESPUES DEL CAMBIO DE LAS
        PARTES SOLICITADAS, SOLO EN ESTE MOMENTO PUEDEN DETERMINAR FALLAS
        OCULTAS EN EL EQUIPO.
      </Text>
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Trabajo realizado:</Text>
          <View style={styles.textArea}>
            <Text>
            {data.labores[(data.labores.length >0)?data.labores.length -1:0].labor}
            </Text>
            {/* {data.labores.map(item=>{
              return (
                <View>
                  <Text>{item.names + " "+ item.lastnames} - {item.labor}</Text>
                  
                </View>
              )
            })} */}
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={styles.label}>Notas y/o recomendaciones:</Text>
          <Text style={styles.textArea}>{data.observaciones}</Text>
        </View>
      </View>
      <View>
        <Text style={{ fontSize: 6 }}>
          LA GARANTÍA CUBRE EXCLUSIVAMENTE DEFECTOS DE FABRICACIÓN, NO CUBRE
          DAÑOS CAUSADOS POR MALA MANIPULACIÓN, CONTAMINACIÓN POR AGENTES
          EXTERNOS, INTERVENCIÓN POR TERCEROS, NI QUE EXCEDA PERIODO DE TIEMPO
          GARANTÍA ACORDADO.
        </Text>
        <Text style={{ fontSize: 6 }}>
          * LAS REPARACIONES EFECTUADAS CON GARANTÍA VIGENTE Y APLICABLE, NO
          TIENEN COSTO PARA EL CLIENTE.
        </Text>
        <Text style={{ fontSize: 6 }}>
          * PARA EQUIPOS FUERA DE GARANTÍA/NO AMPARADOS POR LA GARANTÍA.
        </Text>
        <Text style={{ fontSize: 6 }}>
          TODO SERVICIO PARA PRODUCTOS FUERA DE GARANTÍA TIENE COSTO PARA EL
          CLIENTE. LA COTIZACIÓN TIENE VIGENCIA DE 15 DÍAS. SI PASADOS 15 DÍAS A
          LA FECHA DE RECEPCIÓN DE CORREO DIAGNOSTICO, COTIZACIÓN EL CLIENTE NO
          HA DADO RESPUESTA DE APROBACIÓN O DESAPROBACIÓN EL CASO SERÁ CERRADO
          COMO DEVUELTO SIN REPARAR.
        </Text>
      </View>
    </View>
  );
};

const Authorization = (data) => {
  return (
    <View style={styles.row}>
      <View
        style={{
          flex: 1,
          border: "1px solid #c0c0c0",
          borderStyle: "dashed",
          padding: 5,
          borderRadius: 15,
          margin: 3,
          textAlign: "left",
        }}
      >
        <Text style={styles.bold}>
          AUTORIZACIÓN DE ENTREGA DEL PRODUCTO A TERCEROS.
        </Text>
        <Text
          style={{
            textAlign: "left",
            marginTop: 10,
            fontSize: 8,
            marginBottom: 8,
          }}
        >
          Bajo mi responsabilidad, yo,_________________________________________
          ______________________________identificado con documento de identidad
          N°___________________________________autorizo la entrega del producto
          relacionado en esta orden de servicio a:_____________________________
          ________________________________________identificado con documento de
          identidad N°_________________
        </Text>

        <Text style={{ fontSize: 6 }}>
          *Adjuntar copias del documento de identidad.
        </Text>
        <Text style={{ fontSize: 6 }}>
          **Sin esta autorización, solo se hará la entrega al titular registrado
          en la orden de servicio
        </Text>
        <Text style={{ fontSize: 6 }}>
          ***En caso de extraviarse este documento traer original de la denuncia
          de perdida del documento
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          border: "1px solid #c0c0c0",
          borderStyle: "dashed",
          padding: 10,
          borderRadius: 15,
          margin: 3,
        }}
      >
        <Text style={styles.bold}>RECIBIDO A CONFORMIDAD</Text>
        <Text style={{ marginTop: 90 }}>____________________</Text>
        <Text style={{ fontSize: 9 }}>FIRMA-NOMBRE-CEDULA</Text>
      </View>
    </View>
  );
};

export default MyDocument;
