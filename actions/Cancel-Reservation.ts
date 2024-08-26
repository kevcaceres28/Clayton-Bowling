"use server";

import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const CancelReservations = async (ID: string) => {
  try {
    const user: any = await currentUser();

    if (!user) {
      return {
        error: "Please Logged in First!",
      };
    }

    const cancel = await db.reservations.delete({
      where: {
        id: ID,
      },
    });

    if (!cancel) {
      return {
        error: "Reservation not found",
      };
    }

    return {
      success: "Reservation Canceled!",
    };
  } catch (error: any) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      // This error code indicates that the record to delete was not found
      return {
        error: "Reservation not found",
      };
    } else {
      // Handle other kinds of errors
      return {
        error: `Unable to cancel reservations: ${error.message}`,
      };
    }
  }
};
