"use client";

import React from "react";
import AccountBox from "./AccountBox";
import { USER } from "../../account-details/_components/AccountDetailsForm";

interface AccountMainPageProps {
  currentUser?: any;
}

const AccountMainPage = ({ currentUser }: AccountMainPageProps) => {
  return (
    <div className=" flex flex-col ">
      <div className=" space-y-4">
        <p>
          Hola {currentUser?.name} (usted no{currentUser?.name}? Cerrar la
          sesión)
        </p>
        <p>
          Desde el escritorio de su cuenta puede ver sus pedidos recientes,
          administrar su dirección de facturación y editar su contraseña y
          detalles de cuenta.
        </p>
      </div>

      <AccountBox />
    </div>
  );
};

export default AccountMainPage;
