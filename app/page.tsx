import Contact from "@/components/Contact";
import Facilities from "@/components/Facilites";
import HeroSection from "@/components/Hero-section";
import Map from "@/components/Map";
import TopBar from "@/components/Top-bar";
import { getReservationsOfUser } from "@/lib/getReservations";
import Image from "next/image";

export default async function Home() {
  const reservedData: any = await getReservationsOfUser();
  return (
    <>
      <div className=" text-white  scroll-smooth">
        <TopBar />
        <HeroSection reserved={reservedData} />
        <Facilities />
        <Contact />
        <Map />
        <div className=" text-sm my-2 p-2">
          <p className=" text-[#808080]">
            bolos clayton panamá 2024 Copyright © Todos los derechos reservados.
          </p>
        </div>
      </div>
    </>
  );
}
