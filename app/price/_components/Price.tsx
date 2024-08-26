import Image from "next/image";
import React from "react";

const Price = () => {
  return (
    <div className=" bg-white text-black h-full md:h-[300px]">
      <div className="max-w-6xl mx-auto p-8">
        <div className=" flex flex-col md:flex-row md:space-x-14  ">
          {/* First div  */}
          <div className=" flex flex-col ">
            {/* Heading */}
            <div className="">
              <h1 className=" uppercase text-2xl text-cyan-400 font-bold">
                Precios
              </h1>
            </div>
            {/* Image */}
            <div className=" w-full flex items-center justify-center">
              <Image
                src={
                  "https://bowlingplanetpanama.com/wp-content/uploads/2021/08/iconbolos2-200x200.png"
                }
                alt="Bowling image"
                width={200}
                height={200}
                quality={100}
              />
            </div>
          </div>

          {/* Second Div */}
          <div className=" flex flex-col">
            <p className=" text-[#848484] font-semibold">Horarios y costos:</p>
            <p className=" w-[275px] text-[#848484]">
              Lunes a Jueves de 4pm a 11pm ($25 por hora) Viernes de 4pm a 11pm
              ($30 por hora) Sábado de 3:00pm a 11:00pm ($ 30 por hora) Domingos
              de 2:00 pm a 10:00 pm ($ 30 por hora)
            </p>
          </div>

          {/* Third Div */}
          <div className=" flex flex-col text-[#848484]">
            <div className="">
              <p className=" font-semibold">Extras:</p>
              <p>Alquiler de zapatos {`(2.80 USD)`}</p>
            </div>

            <div className=" w-full flex items-center justify-center">
              <Image
                src={
                  "https://bowlingplanetpanama.com/wp-content/uploads/2021/08/iconzapatos2-200x200.png"
                }
                alt="Bowling Shoe"
                width={200}
                height={200}
                quality={100}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Price;
