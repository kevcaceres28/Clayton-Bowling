import React from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";

const DownloadsPage = () => {
  return (
    <div className=" text-black w-full h-screen">
      <div className=" bg-[#E0B252] w-full p-3 flex flex-col text-center sm:flex-row items-center space-x-4">
        <IoMdInformationCircleOutline className=" text-white text-2xl" />
        <p className=" text-white">Aún no hay descargas disponibles.</p>
        <p className=" underline text-white">EXPLORAR PRODUCTOS</p>
      </div>
    </div>
  );
};

export default DownloadsPage;
