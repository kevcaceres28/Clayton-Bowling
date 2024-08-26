import React from "react";
import AccountMainPage from "./_components/AccountMainPage";
import { currentUser } from "@/lib/currentUser";

const AccountPage = async () => {
  const user: any = await currentUser();

  return (
    <div className=" text-black">
      {/* <AccountForm /> */}
      <AccountMainPage currentUser={user} />
    </div>
  );
};

export default AccountPage;
