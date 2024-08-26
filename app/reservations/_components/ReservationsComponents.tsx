"use client";
import { useReservationStore } from "@/hooks/reservations";
import React, { useEffect, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
// import Calendar from "react-calendar";
import Calendar from "@/components/Calendar";
import "react-calendar/dist/Calendar.css";
import Extras from "./Extras";
import PersonalData from "./PersonalData";
import Cart from "./Cart";
import { reservationsAction } from "@/actions/reservation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Reservations } from "@prisma/client";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ReservationsComponentsProps {
  reservations: {
    data: Reservations;
  };
  allreserved: {
    data: Reservations[];
  };
}

const ReservationsComponents = ({
  reservations,
  allreserved,
}: ReservationsComponentsProps) => {
  const router = useRouter();
  const { currentStep, setCurrentStep } = useReservationStore();
  const [value, onChange] = useState<Value>(new Date());
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [month, setMonth] = useState("");
  const [dateOfMonth, setDateOfMonth] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [duration, setDuration] = useState("");
  const [year, setYear] = useState("");
  const [personalData, setPersonalData] = useState({
    fullName: "",
    PhoneNumber: "",
    email: "",
    confirmEmail: "",
    birthMonth: "",
    birthDay: "",
    birthYear: "",
  });
  const [extrasInfo, setExtrasInfo] = useState({ count: 0, totalPrice: 0 });
  const [price, setPrice] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [isPending, startTransaction] = useTransition();

  console.log("Date Range ---> ", dateRange);

  // console.log("🚀 ~ ReservationsComponents ~ selectedTime:", selectedTime);
  // console.log("🚀 ~ ReservationsComponents ~ currentStep:", currentStep);

  useEffect(() => {
    if (value instanceof Date && !isNaN(value as any)) {
      const dayOfWeek = value.getDay(); // Day of the week (0-6, where 0 is Sunday)
      const month = value.getMonth(); // Month (0-11, where 0 is January)
      const dateOfMonth = value.getDate(); // Date of the month (1-31)
      const year = value.getFullYear(); // Year

      // Optionally, format month and day to be more readable
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      setDayOfWeek(days[value.getDay()]);
      setMonth(months[value.getMonth()]);
      setDateOfMonth(value.getDate());
      setYear(value.getFullYear().toString());

      // console.log("Day of the week:", days[dayOfWeek]);
      // console.log("Month:", months[month]);
      // console.log("Date of the month:", dateOfMonth);
      // console.log("Year:", year);
    }
  }, [value]); // This will log the details every time 'value' changes

  useEffect(() => {
    let summaryPrice = 0;
    if (!duration || duration === "") {
      switch (serviceName) {
        case "Rent Monday to Tuesday at USD 25":
          summaryPrice = 25;
          break;
        case "Rent Friday at 30 USD":
          summaryPrice = 30;
          break;
        case "Weekends Rentals at 30 USD":
          summaryPrice = 30;
          break;
        // ... other cases
      }
    } else {
      switch (duration) {
        case "2 h ($60,00)":
          summaryPrice = 60;
          break;
        case "3 h ($90,00)":
          summaryPrice = 90;
          break;
        // ... other cases
      }
    }

    // Then, add the total price of extras to the summary price
    if (extrasInfo && extrasInfo.totalPrice) {
      summaryPrice += extrasInfo.totalPrice;
    }
    setPrice(summaryPrice);
  }, [serviceName, duration, extrasInfo]);

  // Convert your reserved dates to Date objects
  const disabledDates = allreserved?.data?.map(
    (reservation) => reservation.dateOfMonth
  );

  // Handle change of the date range
  const handleSelect = (ranges: any) => {
    const { selection } = ranges;
    setDateRange(selection);
  };

  // Extracting date components from the startDate of dateRange
  var selectedDate = new Date(dateRange.startDate);
  var formattedDayOfWeek = selectedDate.toLocaleString("en-US", {
    weekday: "short",
  }); // "Sunday", "Monday", ...
  var formattedMonth = selectedDate.toLocaleString("en-US", {
    month: "short",
  }); // "January", "February", ...
  var FormatteddateOfMonth = selectedDate.getDate();
  var Formattedyear = selectedDate.getFullYear();
  // handle Cart Function
  const handleCart = () => {
    startTransaction(() => {
      reservationsAction({
        date: selectedDate.toISOString() as any, // Assuming this needs the full Date object
        dayOfWeek: formattedDayOfWeek,
        month: formattedMonth,
        dateOfMonth: FormatteddateOfMonth.toString(),
        year: Formattedyear.toString(),
        time: selectedTime,
        serviceName: serviceName,
        duration: duration,
        fullName: personalData?.fullName,
        phoneNumber: personalData?.PhoneNumber,
        email: personalData?.email,
        confirmEmail: personalData?.confirmEmail,
        birthMonth: personalData?.birthMonth,
        birthDay: personalData?.birthDay.toString(),
        birthYear: personalData?.birthYear.toString(),
        extraPrice: extrasInfo?.totalPrice.toString(),
        price: price.toString(),
      }).then((data) => {
        if (data.success) {
          toast.success(data.success);
          router.push("/cart");
        }

        if (data.error) {
          toast.error(data.error);
        }
      });
    });
  };

  // Function to handle step change, for example
  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const goToBackStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleTimeSelect = (time: any) => {
    setSelectedTime(time);
  };

  const handleExtrasChange = (count: any, totalPrice: any) => {
    setExtrasInfo({ count, totalPrice });
  };

  const handlePersonalDataChange = (key: any, value: any) => {
    setPersonalData((prevData) => ({ ...prevData, [key]: value }));
  };

  const renderSummary = () => {
    return (
      <p className="mt-4 text-[#848484] font-bold">
        Summary: $ {price.toFixed(2)}
      </p>
    );
  };

  const reservedDates = allreserved.data.map((reservation) => {
    {
      return {
        date: reservation.dateOfMonth,
        time: reservation.time,
      };
    }
  });

  console.log("Reservation --> ", reservedDates);

  return (
    <>
      <div className="bg-white text-black h-full md:h-[560px]">
        <div className="max-w-6xl mx-auto p-8">
          {reservations?.data?.status === "COMPLETE" ? (
            <>
              <div className="flex flex-row items-center justify-between md:justify-start md:space-x-6 lg:space-x-4">
                {/* Mapping through steps */}
                {[
                  "Corte y dia",
                  "Fecha y hora",
                  "Extras",
                  "Informacion personal",
                  "Payment",
                  "Datos de pago personales",
                ].map((step, index) => (
                  <>
                    <div key={index} className="flex flex-col">
                      <p className=" hidden md:block text-sm ml-1 mb-1 text-[#848484] font-bold truncate">
                        {step}
                      </p>
                      <div
                        className={` hidden md:block h-[10px] md:w-[100px] lg:w-[150px] ${
                          currentStep >= index ? "bg-[#23A4E0]" : "bg-[#23A4E0]"
                        } ${index === 0 ? "rounded-l-md" : ""} ${
                          index === 5 ? "rounded-r-md" : ""
                        }`}
                      ></div>
                      <div
                        className={` flex items-center justify-center md:hidden h-[30px] w-[30px] rounded-full  ${
                          currentStep >= index ? "bg-[#23A4E0]" : "bg-[#23A4E0]"
                        } ${index === 0 ? " rounded-full" : ""} ${
                          index === 5 ? " rounded-full" : ""
                        }`}
                      >
                        <span className="text-white font-bold">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                  </>
                ))}
              </div>
              <div className=" w-full flex flex-row items-center justify-center">
                <p className=" text-[#848484] font-medium text-lg mt-10">
                  ¡Gracias! El proceso de reserva ha sido completado. Tú Se le
                  ha enviado un correo electrónico con los detalles de su
                  reserva y la posibilidad de cancelarlo hasta x horas antes de
                  tomar él.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Top bar */}
              <div className="flex flex-row items-center justify-between  md:space-x-6 lg:space-x-4">
                {/* Mapping through steps */}
                {[
                  "Corte y dia",
                  "Fecha y hora",
                  "Extras",
                  "Informacion personal",
                  "Payment",
                  "Datos de pago personales",
                ].map((step, index) => (
                  <>
                    <div key={index} className="flex flex-col">
                      <p className=" hidden md:block text-sm ml-1 mb-1 text-[#848484] font-bold truncate">
                        {step}
                      </p>
                      <div
                        className={` hidden md:block h-[10px] md:w-[100px] lg:w-[150px] ${
                          currentStep >= index ? "bg-[#23A4E0]" : "bg-[#BEC3C7]"
                        } ${index === 0 ? "rounded-l-md" : ""} ${
                          index === 5 ? "rounded-r-md" : ""
                        }`}
                      ></div>
                      <div
                        className={` flex items-center justify-center md:hidden h-[30px] w-[30px] rounded-full  ${
                          currentStep >= index ? "bg-[#23A4E0]" : "bg-[#BEC3C7]"
                        } ${index === 0 ? " rounded-full" : ""} ${
                          index === 5 ? " rounded-full" : ""
                        }`}
                      >
                        <span className="text-white font-bold">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                  </>
                ))}
              </div>

              {/* Step 0 content */}
              {currentStep === 0 && (
                <>
                  <div
                    className=" text-sm mt-6
               font-semibold"
                  >
                    <p className=" text-[#848484]">
                      A. Selecciona qué día deseas alquilar una cancha
                    </p>
                    <p className="text-[#848484]">Horarios y Costos:</p>
                    <p className="text-[#848484]">
                      Lunes a Jueves de 4pm a 11pm ($25 por hora)
                    </p>
                    <p className="text-[#848484]">
                      Viernes de 4pm a 11pm ($30 por hora)
                    </p>
                    <p className="text-[#848484]">
                      Sábado de 15 a 23 ($ 30 por hora)
                    </p>
                    <p className="text-[#848484]">
                      Domingo de 14 a 22 horas ($ 30 por hora)
                    </p>
                    <p className="text-[#848484]">
                      B. Seleccione un tribunal para Cualquier persona y el
                      sistema le dará la el primero disponible.
                    </p>
                    <p className="text-[#848484]">
                      C. Seleccione la Duración (nuestros turnos son de 1 hora y
                      puede tomar varios seguidos)
                    </p>
                    <div className=" text-[#848484] mt-6 mb-2">
                      <p>IMPORTANTE: Máximo 6 jugadores por cancha</p>
                    </div>

                    <div className=" flex flex-col md:flex-row items-center justify-between w-full space-y-4 md:space-y-0 md:space-x-3">
                      {/* First */}
                      <div className=" w-full">
                        <p className=" mb-1">
                          A. Seleccione el día de la reserva.
                        </p>
                        <Select
                          onValueChange={(value) => {
                            setServiceName(value);
                          }}
                        >
                          <SelectTrigger className=" w-full">
                            <SelectValue placeholder="What day of the week do you prefer ?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Rent Monday to Tuesday at USD 25">
                              Alquiler de lunes a martes a USD 25
                            </SelectItem>
                            <SelectItem value="Rent Friday at 30 USD">
                              Alquiler viernes a 30 USD
                            </SelectItem>
                            <SelectItem value="Weekends Rentals at 30 USD">
                              Alquileres de fin de semana a 30 USD
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Second */}
                      <div className=" w-full">
                        <p className=" mb-1">B. Cancha para alquilar</p>
                        <Select>
                          <SelectTrigger className=" w-full">
                            <SelectValue placeholder="Anyone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Alguien</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Third */}
                      <div className=" w-full">
                        <p className=" mb-1">C. Duración</p>
                        <Select
                          onValueChange={(value) => {
                            setDuration(value);
                          }}
                        >
                          <SelectTrigger className=" w-full">
                            <SelectValue placeholder="--" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2 h ($60,00)">
                              2 h ($60,00)
                            </SelectItem>
                            <SelectItem value="3 h ($90,00)">
                              3 h ($90,00)
                            </SelectItem>
                            <SelectItem value="4 h ($120,00)">
                              4 h ($120,00)
                            </SelectItem>
                            <SelectItem value="5 h ($150,00)">
                              5 h ($150,00)
                            </SelectItem>
                            {serviceName === "Weekends Rentals at 30 USD" && (
                              <>
                                <SelectItem value="6 h ($180,00)">
                                  6 h ($180,00)
                                </SelectItem>
                                <SelectItem value="7 h ($210,00)">
                                  7 h ($210,00)
                                </SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* border line */}
                    <div className=" border-b-2 border-[#BEC3C7] mt-6"></div>

                    {/* Button */}
                    {serviceName.length > 0 && (
                      <>
                        <div className=" w-full flex item justify-end">
                          <Button
                            onClick={goToNextStep}
                            className=" bg-cyan-500 hover:bg-blue-600  mt-2 flex items-center justify-center"
                          >
                            Siguiente
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <div className="">
                    <div className=" mt-4 text-sm md:text-base">
                      <p>
                        A continuación puede encontrar la lista de intervalos de
                        tiempo de inicio. Disponible para el alquiler de la
                        cancha.
                      </p>
                      <p>
                        Seleccione la hora de inicio disponible para continuar
                        con el reserva.
                      </p>
                    </div>
                    <div className=" flex flex-col md:flex-row  mt-3 w-full">
                      <div className=" flex items-center justify-center">
                        {/* <Calendar
                          onChange={onChange}
                          value={value}
                          className={" "}
                          defaultView="month"
                        /> */}
                        <Calendar
                          value={dateRange}
                          onChange={handleSelect}
                          disabledDates={disabledDates as any}
                        />
                      </div>
                      <div className=" md:ml-4 flex flex-col mt-6 ">
                        <div className=" bg-cyan-500 rounded-md p-2">
                          {/* <p className=" text-sm text-white text-center font-semibold">
                            {dayOfWeek},{month}
                            {dateOfMonth}
                          </p> */}
                          <p className=" text-sm text-white text-center font-semibold">
                            {formattedDayOfWeek} , {formattedMonth}
                            <span className=" ml-1">
                              {FormatteddateOfMonth}
                            </span>
                          </p>
                        </div>
                        {/* First */}
                        <div className="space-y-2 mt-1">
                          {[
                            "4:00 pm",
                            "5:00 pm",
                            "6:00 pm",
                            "7:00 pm",
                            "8:00 pm",
                            "9:00 pm",
                            "10:00 pm",
                          ].map((time) => {
                            const isReserved = reservedDates.some(
                              (reservation) =>
                                reservation?.date ==
                                  (FormatteddateOfMonth as any) &&
                                reservation.time === time
                            );
                            return (
                              <div
                                key={time}
                                onClick={() =>
                                  !isReserved && handleTimeSelect(time)
                                }
                                className={`border-2 bg-[#ffffff] border-gray-300 p-0.5 rounded-md hover:bg-cyan-500 transition duration-300 ease-in-out ${
                                  selectedTime === time ? "bg-cyan-500" : ""
                                } ${
                                  isReserved
                                    ? "opacity-50 cursor-not-allowed line-through"
                                    : "hover:cursor-pointer"
                                }`}
                              >
                                <p className="text-center">{time}</p>
                              </div>
                            );
                          })}
                        </div>

                        {/* End */}
                      </div>
                    </div>
                    <div className=" flex w-full items-center justify-between">
                      <div className="">
                        <Button
                          onClick={goToBackStep}
                          className=" bg-cyan-500 hover:bg-blue-600  mt-2 flex items-center justify-center"
                        >
                          Previo
                        </Button>
                      </div>
                      <Button
                        onClick={goToNextStep}
                        className=" bg-cyan-500 hover:bg-blue-600  mt-2 flex items-center justify-center"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <Extras onCountChange={handleExtrasChange} />
                  {/* Summary */}

                  {renderSummary()}

                  {/* border line */}
                  <div className=" border-b-2 border-[#BEC3C7] "></div>

                  <div className=" flex flex-row items-center justify-between mt-2 mb-6 ">
                    <div className="">
                      <Button
                        onClick={goToBackStep}
                        className=" bg-cyan-500 hover:bg-blue-600  mt-2 flex items-center justify-center"
                      >
                        Previo
                      </Button>
                    </div>

                    <div className="">
                      <Button
                        onClick={goToNextStep}
                        className=" bg-cyan-500 hover:bg-blue-600  mt-2 flex items-center justify-center"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <PersonalData
                    time={selectedTime}
                    month={month}
                    date={dateOfMonth}
                    year={year}
                    onPersonalDataChange={handlePersonalDataChange}
                    data={personalData}
                  />
                  {/* border line */}
                  <div className=" border-b-2 border-[#BEC3C7] "></div>

                  <div className=" flex flex-row items-center justify-between mt-2 mb-6 ">
                    <div className="">
                      <Button
                        onClick={goToBackStep}
                        className=" bg-cyan-500 hover:bg-blue-600  mt-2 flex items-center justify-center"
                      >
                        Previo
                      </Button>
                    </div>

                    <div className="">
                      <Button
                        // onClick={goToNextStep}
                        disabled={isPending}
                        onClick={handleCart}
                        className=" bg-cyan-500 hover:bg-blue-600  mt-2 flex items-center justify-center"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {/* Example button to go to next step */}
          {/* <button onClick={goToNextStep}>Next Step</button> */}

          {/* {currentStep === 4 && (
            <>
              <Cart />
            </>
          )} */}
        </div>
      </div>
    </>
  );
};

export default ReservationsComponents;
