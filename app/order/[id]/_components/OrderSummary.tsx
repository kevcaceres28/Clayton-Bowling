"use client";
import { Button } from "@/components/ui/button";
import { BillingDetails, Order, Reservations } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";

interface OrderSummaryProps {
  order: {
    data: Order;
  };
  reserved: {
    data: Reservations;
  };
  billing: {
    data: BillingDetails;
  };
}

const OrderSummary = ({ order, reserved, billing }: OrderSummaryProps) => {
  const router = useRouter();
  const dateObj: Date = new Date(order?.data?.date);

  // Use Intl.DateTimeFormat to format the date
  let formattedDate;
  if (dateObj) {
    formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })?.format(dateObj);
  }

  return (
    <>
      <div className=" bg-white  min-h-screen flex items-center justify-center py-12">
        <div className="bg-white  rounded-lg px-8 pt-6 pb-8 mb-4 max-w-2xl w-full">
          <div className="mb-6 border-b-2 border-gray-100 pb-4">
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              Gracias. Tu orden ha sido recibida.
            </h1>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Número de orden:</span>
              <span className="text-gray-800 font-semibold">
                {order?.data?.id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fecha:</span>
              {/* <span className="text-gray-800 font-semibold">April 4, 2024</span> */}
              <span className="text-gray-800 font-semibold">
                {formattedDate}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Correo electrónico:</span>
              {/* <span className="text-blue-500 font-semibold">
              muhammadmahdi512@gmail.com
            </span> */}
              <span className="text-blue-500 font-semibold">
                {order?.data?.email}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total:</span>
              <span className="text-green-500 font-semibold">
                ${order?.data?.totalPrice}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Métodos de pago:</span>
              <span className="text-orange-500 font-semibold">
                Pago en sitio
              </span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              DETALLES DEL PEDIDO
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Cancha de bolos x 1</span>
                <span className="text-gray-800 font-semibold">
                  ${reserved?.data.price}
                </span>
              </div>
              <div className="text-gray-700 py-2">
                <span>Alquiler</span>
                {/* <span>{reserved?.data?.serviceName}</span> */}
              </div>
              <div className="text-gray-700 py-2">
                <span>Fecha:{formattedDate}</span>
              </div>
              <div className="text-gray-700 py-2">
                {/* <span>Time: 6:00 pm</span> */}
                <span>Tiempo: {reserved?.data.time}</span>
              </div>
              <div className="text-gray-700 py-2">
                <span>Servicio: {reserved?.data?.serviceName}</span>
              </div>
              <div className="flex justify-between items-center border-t-2 border-gray-200 pt-4 mt-4">
                <span className="text-gray-600 font-semibold">
                  Total parcial:
                </span>
                <span className="text-gray-800 font-semibold">
                  ${reserved?.data.price}
                </span>
              </div>
              <div className="flex justify-between items-center border-t-2 border-gray-200 pt-4">
                <span className="text-lg font-bold text-gray-800">TOTAL:</span>
                <span className="text-lg font-bold text-green-500">
                  ${reserved?.data.price}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              DIRECCIÓN DE ENVIO
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 py-2">{billing?.data?.name}</p>
              <p className="text-gray-700 py-2">{billing?.data?.phoneNumber}</p>
              <p className="text-blue-500 py-2">{billing?.data?.email}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Button */}
      <Button
        className=" max-w-6xl mx-auto flex flex-row items-center justify-center bg-cyan-500 hover:bg-blue-600 transition duration-500 ease-in-out"
        size={"lg"}
        onClick={() => router.push("/")}
      >
        De vuelta a casa
      </Button>
    </>
  );
};

export default OrderSummary;
