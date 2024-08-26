"use client";
import { CancelReservations } from "@/actions/Cancel-Reservation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { toast } from "sonner";

const Cancelcomponent = ({ id }: { id: string }) => {
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const handleCancel = () => {
    startTransaction(() => {
      CancelReservations(id).then((data) => {
        if (data.success) {
          toast.success(data.success);
          router.push("/");
        }
        if (data.error) {
          toast.error(data.error);
        }
      });
    });
  };
  return (
    <div className=" max-w-6xl mx-auto flex flex-col items-center mt-4 ">
      <h1 className="text-center text-black text-2xl md:text-4xl font-bold mb-6">
        Cancelar la reserva
      </h1>
      <div className=" flex flex-row items-center  space-x-6">
        <div className="">
          <Button
            disabled={isPending}
            onClick={handleCancel}
            variant={"destructive"}
          >
            Cancelar la reserva
          </Button>
        </div>
        <div className="">
          <Button onClick={() => router.push("/")}>De vuelta a casa</Button>
        </div>
      </div>
    </div>
  );
};

export default Cancelcomponent;
