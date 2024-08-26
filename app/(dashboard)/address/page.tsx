import {
  getAllBillingDetails,
  getBillingDetails,
} from "@/actions/billingDetails";
import { currentUser } from "@/lib/currentUser";
import React from "react";

const AddressPage = async () => {
  const user: any = await currentUser();
  // const billing = await getBillingDetails(user.id);
  const billing = await getAllBillingDetails(user.id);

  if (!billing) {
    return (
      <div className=" text-black w-full h-screen">
        <div className="">
          <p>
            Las siguientes direcciones se utilizarán de forma predeterminada en
            la página de pago.
          </p>
        </div>
        {/* Heading */}
        <div className=" text-xl font-bold mt-4">
          <h2>DIRECCIÓN DE ENVIO</h2>
        </div>

        <div className=" mt-4">
          <p>Aún no has configurado este tipo de dirección.</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="text-black w-full min-h-screen flex flex-col p-4 sm:p-8">
        <div>
          <p className="text-base sm:text-lg">
            Las siguientes direcciones se utilizarán de forma predeterminada en
            la página de pago.
          </p>
        </div>

        {/* Heading */}
        <div className="text-2xl font-bold mt-6">
          <h2>DIRECCIÓN DE ENVIO</h2>
        </div>

        {/* Address Box */}
        {billing?.data?.map((bill) => (
          <>
            <div className="mt-6 bg-white p-6 rounded-lg shadow-lg w-full sm:max-w-md mx-auto text-wrap">
              <p className="text-lg sm:text-xl font-semibold">{bill?.name}</p>
              <p className="my-2">{bill?.phoneNumber}</p>
              <p className=" break-words">{bill?.email}</p>
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default AddressPage;
