"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useTransition } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { BillingDetails, Reservations } from "@prisma/client";
import { billingDetails } from "@/actions/billingDetails";
import { toast } from "sonner";
import { updateReservation } from "@/lib/getReservations";
import { CreateOrder } from "@/actions/order";
import { useRouter } from "next/navigation";
import { sendReservationEmail } from "@/lib/mail";

interface CheckOutComponentProps {
  reserved: Reservations[];
  billing: {
    data: BillingDetails;
  };
}

const CheckOutComponent = ({ reserved, billing }: CheckOutComponentProps) => {
  const router = useRouter();
  const [name, setname] = useState<any>(billing?.data?.name);
  const [phoneNumber, setphoneNumber] = useState<any>(
    billing?.data?.phoneNumber
  );
  const [email, setemail] = useState<any>(billing?.data?.email);
  const [isPending, startTransaction] = useTransition();

  const calculateTotal = () => {
    return reserved.reduce(
      (total, reservation) => total + parseFloat(reservation.price || "0"),
      0
    );
  };

  //   const handleSubmit =  () => {
  //     startTransaction( () => {
  //       billingDetails({
  //         name,
  //         phoneNumber,
  //         email,
  //       }).then((data) => {
  //         if (data.success) {
  //           toast.success(data.success);

  //           // After successful billing, update each reservation status
  //           for (const reservation of reserved) {
  //             const updateData = await updateReservation(reservation.id);
  //             if (updateData.error) {
  //               toast.error(updateData.error);
  //             }
  //           }
  //         }

  //         if (data.error) {
  //           toast.error(data.error);
  //         }
  //       });
  //     });
  //   };

  const handleSubmit = () => {
    startTransaction(async () => {
      // Declare this function as async
      const billingResponse = await billingDetails({
        name,
        phoneNumber,
        email,
      });

      if (billingResponse.success) {
        toast.success(billingResponse.success);

        // Aggregating dates from reservations
        const reservationDates = reserved
          .map((reservation) => {
            const date = new Date(
              `${reservation.year}-${reservation.month}-${reservation.dateOfMonth}`
            );
            return date.toISOString();
          })
          .join(", ");

        // Calculate total price and convert it to a float
        const totalPrice = parseFloat(calculateTotal().toFixed(2));

        // Creating the order
        const orderResponse = await CreateOrder(
          reservationDates,
          email,
          totalPrice
        );

        if (orderResponse.success) {
          toast.success(orderResponse.success);

          // Iterate over each reservation and update its status
          for (const reservation of reserved) {
            const updateData = await updateReservation(reservation.id);
            if (updateData.error) {
              toast.error(updateData.error);
            }
          }

          router.push(`/order/${orderResponse.data.id}`);

          // Prepare and send the reservation email
          try {
            const emailReservationDetails = {
              userName: name,
              items: reserved.map((r) => ({
                serviceName: r.serviceName,
                date: `${r.month} ${r.dateOfMonth}, ${r.year} `,
                time: r.time,
                price: r.price,
                extraPrice: r.extraPrice,
                cancelationLink: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel-reservation/${r.id}`,
              })),
              total: totalPrice,
            };
            await sendReservationEmail(emailReservationDetails, email);
            console.log("Email sent successfully.");
          } catch (error) {
            console.error("Failed to send email:", error);
          }
          // Additional logic for successful update
          // e.g., redirect to a success page
        } else if (orderResponse.error) {
          toast.error(orderResponse.error);
          console.log("Order Response error --> ", orderResponse.error);
        }

        // Additional logic for successful update
        // e.g., redirect to a success page
      } else if (billingResponse.error) {
        toast.error(billingResponse.error);
      }
    });
  };

  return (
    <>
      <div className=" flex flex-row justify-between text-black max-w-6xl mx-auto mt-6 space-x-4">
        {/* Left Side */}
        <div className=" p-2 w-full">
          {/* Heading */}
          <div className="">
            <h1 className=" text-2xl font-semibold">Detalles de facturación</h1>
          </div>

          {/* Form */}
          <div className=" flex flex-col space-y-4 mt-2">
            {/* Name */}
            <div className=" w-full space-y-1">
              <Label>Nombre</Label>
              <Input
                placeholder="John doe"
                className=" w-full"
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
            </div>

            {/* Phone Number */}
            <div className=" w-full space-y-1">
              <Label>Número de teléfono</Label>
              <PhoneInput
                placeholder="Enter phone number"
                value={phoneNumber}
                //@ts-ignore
                onChange={setphoneNumber}
                className=" border-2 border-gray-300 rounded-md p-1  custom-phone-input outline-none focus:border-none  "
              />
            </div>

            {/* email */}
            <div className=" w-full space-y-1">
              <Label>Correo electrónico</Label>
              <Input
                placeholder="johndoe@gmail.com"
                className=" w-full"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* max-w-sm mx-auto  */}
        <div className=" text-black p-4 border border-gray-200 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-center border-b pb-4">
            SU PEDIDO
          </h2>

          {/* Product Summary */}
          <div className="border-b py-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">PRODUCTO</span>
              <span className="font-semibold">TOTAL PARCIAL</span>
            </div>

            {/* Iterating over each reservation */}
            {reserved.map((reservation, index) => (
              <div key={index}>
                <p className="font-semibold">{reservation.serviceName} × 1</p>
                <p className="text-sm text-gray-600">
                  Para alquilar: Fecha:{" "}
                  {`${reservation.month} ${reservation.dateOfMonth}, ${reservation.year}`}
                </p>
                <p className="text-sm text-gray-600">
                  Tiempo: {reservation.time}
                </p>
                <p className="text-sm text-gray-600">
                  Precio: ${reservation.price}
                </p>
                <p className="text-sm text-gray-600">
                  Extras: {reservation.extraPrice}
                </p>
              </div>
            ))}

            <div className="flex justify-between font-semibold pt-2">
              <span>Total parcial</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Total Price */}
          <div className="flex justify-between py-4 font-semibold">
            <span>Total</span>
            <span className="text-xl text-blue-600">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>

          {/* Payment Info */}
          <div className="border-t pt-4">
            <p className="text-sm font-semibold mb-2">Pago en sitio</p>
            <p className="text-sm mb-4">Paga cuando recibas la cancha.</p>
          </div>

          {/* Terms and Privacy */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">
              Sus datos personales se utilizarán para respaldar su experiencia
              en este sitio web, para gestionar el acceso a su cuenta y para
              otros fines descrito en nuestra política de privacidad.
            </p>
            <div className="flex items-center mb-4">
              <input type="checkbox" id="terms" className="mr-2" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                He leído y acepto los términos y condiciones de la web *
              </label>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            disabled={isPending}
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
          >
            HACER EL PEDIDO
          </button>
        </div>
      </div>
    </>
  );
};

export default CheckOutComponent;
