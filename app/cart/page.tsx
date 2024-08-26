import TopBar from "@/components/Top-bar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoIosSearch } from "react-icons/io";
import logo from "../../public/bowling-logo.png";
import CartComponent from "./_components/CartComponent";
import { getReservationsOfUser } from "@/lib/getReservations";
import { Reservations } from "@prisma/client";

const CartPage = async () => {
  const reservedData: any = await getReservationsOfUser();
  console.log("Reserved ---> ", reservedData);

  return (
    <>
      <div className=" text-white">
        <div className=" lg:hidden flex items-center justify-center w-full bg-neutral-800">
          <Image src={logo} alt="Logo" height={90} width={90} quality={100} />
        </div>
        <TopBar />
        <div className="bg-neutral-800">
          {/* Content (including logo) */}
          <div className="  hidden  max-w-6xl mx-auto p-4 lg:flex justify-between  ">
            {/* Logo */}
            <div>
              <Image src={logo} alt="Logo" height={148} width={250} />
            </div>

            {/* Menu Items */}
            <div className=" flex flex-row items-center ">
              <ul className=" flex flex-row space-x-6 ">
                <a href="/">
                  <li className=" hover:text-cyan-500 hover:cursor-pointer duration-500 ease-in-out">
                    COMENZAR
                  </li>
                </a>
                <a href="#US">
                  <li className="hover:text-cyan-500 hover:cursor-pointer duration-500 ease-in-out">
                    NOSOTROS
                  </li>
                </a>
                <a href="#FACILITIES">
                  <li className="hover:text-cyan-500 hover:cursor-pointer duration-500 ease-in-out">
                    INSTALACIONES
                  </li>
                </a>
                <a href="swagger.pdf" target="_blank" rel="noopener noreferrer">
                  <li className="hover:text-cyan-500 hover:cursor-pointer duration-500 ease-in-out">
                    MENU
                  </li>
                </a>
                <Link href={"/price"}>
                  <li className="hover:text-cyan-500 hover:cursor-pointer duration-500 ease-in-out">
                    PRECIOS
                  </li>
                </Link>
                <li className="hover:text-cyan-500 hover:cursor-pointer duration-500 ease-in-out">
                  RESERVAS
                </li>
                <a href="#Contact">
                  <li className="hover:text-cyan-500 hover:cursor-pointer duration-500 ease-in-out">
                    CONTACTO
                  </li>
                </a>
                <IoIosSearch
                  size={24}
                  className="hover:text-cyan-500 hover:cursor-pointer duration-500 ease-in-out"
                />
              </ul>
            </div>
          </div>
        </div>

        <div className="  bg-white h-full my-6 py-6">
          <CartComponent reserved={reservedData} />
        </div>
      </div>
    </>
  );
};

export default CartPage;
