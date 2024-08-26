import { getBillingDetails } from "@/actions/billingDetails";
import { getOrderByUserId } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/currentUser";
import Link from "next/link";
import React from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";

const OrderPage = async () => {
  const user: any = await currentUser();
  const order = await getOrderByUserId(user.id);
  console.log("🚀 ~ OrderPage ~ order:", order);

  // const dateObj: Date = new Date(order?.data?.date as any);

  // Use Intl.DateTimeFormat to format the date
  // let formattedDate;
  // if (dateObj) {
  //   formattedDate = new Intl.DateTimeFormat("en-US", {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   })?.format(dateObj);
  // }

  const formatDate = (dateString: any) => {
    const dateObj = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(dateObj);
  };

  if (!order) {
    return (
      <div className="text-black w-full h-screen flex justify-center items-center">
        <div className="bg-[#E0B252] w-full p-3 flex flex-col text-center sm:flex-row items-center space-x-4">
          <IoMdInformationCircleOutline className="text-white text-2xl" />
          <p className="text-white">Aún no se ha realizado ningún pedido.</p>
          <Link href="/products">
            <a className="underline text-white">EXPLORAR PRODUCTOS</a>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="bg-white shadow overflow-hidden rounded-lg w-full">
        <div className="px-4 py-5 sm:px-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {/* Add responsive classes for text size */}
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs sm:text-sm leading-4 font-semibold text-gray-800 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs sm:text-sm leading-4 font-semibold text-gray-800 uppercase tracking-wider">
                    Fecha
                  </th>
                  {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs sm:text-sm leading-4 font-semibold text-gray-800 uppercase tracking-wider">
                  Estado
                  </th> */}
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs sm:text-sm leading-4 font-semibold text-gray-800 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs sm:text-sm leading-4 font-semibold text-gray-800 uppercase tracking-wider">
                    Comportamiento
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-x-2 divide-gray-200">
                {order?.data?.map((order, index) => (
                  <tr key={index} className="text-xs sm:text-sm">
                    <td className="px-6 py-4 whitespace-no-wrap text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-gray-900">
                      {formatDate(order.date)}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-no-wrap text-gray-900">
                      Processing
                    </td> */}
                    <td className="px-6 py-4 whitespace-no-wrap text-gray-900">
                      {`$${order.totalPrice} for 1 item`}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-right">
                      <Link href={`/order/${order.id}`}>
                        {/* Assume Button is imported and styled as before */}
                        <Button variant="ghost">Ver</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
