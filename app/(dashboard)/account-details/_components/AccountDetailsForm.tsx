"use client";
import { updateAccountDetails } from "@/actions/update";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@prisma/client";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export interface USER {
  User: User;
}

const AccountDetailsForm = ({ User }: USER) => {
  const [firstName, setfirstName] = useState(User?.firstName);
  const [lastName, setlastName] = useState(User?.lastName);
  const [email, setemail] = useState(User?.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [visibleName, setvisibleName] = useState(User?.name);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransaction] = useTransition();

  const handleSubmit = () => {
    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return; // Prevent form submission
    }
    startTransaction(() => {
      updateAccountDetails({
        firstName: firstName as string,
        lastName: lastName as string,
        email: email as string,
        currentPassword: currentPassword as string,
        newPassword: newPassword as string,
        name: visibleName as string,
      }).then((data) => {
        if (data.success) {
          toast.success(data.success);
        }
        if (data.error) {
          toast.error(data.error);
        }
      });
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  return (
    <div className=" w-full">
      <div className=" flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 w-full">
        {/* Name */}
        <div className=" flex flex-col space-y-2 w-full ">
          <Label>Nombre</Label>
          <Input
            placeholder="Name"
            className=" w-full lg:w-[300px]"
            value={firstName || ""}
            onChange={(e) => setfirstName(e.target.value)}
          />
        </div>
        {/* Sur Name */}
        <div className=" flex flex-col space-y-2  w-full">
          <Label>Apellido</Label>
          <Input
            placeholder="Name"
            className=" w-full lg:w-[300px]"
            value={lastName || ""}
            onChange={(e) => setlastName(e.target.value)}
          />
        </div>
      </div>

      {/* Visible name */}
      <div className="flex flex-col mt-8 space-y-2 ">
        <Label>Nombre visible</Label>
        <Input
          placeholder="Name"
          className=" w-full"
          value={visibleName || ""}
          onChange={(e) => setvisibleName(e.target.value)}
        />
        <p>
          Así será como se mostrará su nombre en la sección de su cuenta y en
          las evaluaciones
        </p>
      </div>
      {/* Email name */}
      <div className="flex flex-col mt-8 space-y-2 ">
        <Label>Correo electrónico</Label>
        <Input
          placeholder="Name"
          className=" w-full"
          value={email || ""}
          onChange={(e) => setemail(e.target.value)}
        />
      </div>

      {/* Password Change */}
      <div className=" flex flex-col mt-8">
        <Label className=" text-xl">Cambio de contraseña</Label>

        {/* Current Password */}
        <div className=" space-y-2 mt-4">
          <Label>
            Contraseña actual (déjalo en blanco para que no lo hagas cambialo)
          </Label>
          <Input
            placeholder="Current Password"
            className=" w-full"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            type="password"
          />
        </div>
        {/* New Password */}
        <div className=" space-y-2 mt-4">
          <Label>Nueva contraseña (déjela en blanco para no cambiarla)</Label>
          <Input
            placeholder="Current Password"
            className=" w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
          />
        </div>
        {/* Confirm Password */}
        <div className=" space-y-2 mt-4">
          <Label>
            Confirmar contraseña (déjela en blanco para no cambiarla)
          </Label>
          <Input
            placeholder="Current Password"
            className=" w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
          />
        </div>

        <Button
          disabled={isPending}
          onClick={handleSubmit}
          className=" bg-cyan-500 mt-8"
        >
          Guardar cambios
        </Button>
      </div>
    </div>
  );
};

export default AccountDetailsForm;
