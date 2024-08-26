"use server";

import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";

interface billingDetailsProps {
  name: string;
  phoneNumber: string;
  email: string;
}

// export const billingDetails = async (options: billingDetailsProps) => {
//   try {
//     const { name, phoneNumber, email } = options;

//     const user: any = await currentUser();

//     if (!name || !phoneNumber || !email) {
//       return {
//         error: "Fields are required !",
//       };
//     }

//     const addBillingDetails = await db.billingDetails.create({
//       data: {
//         name,
//         phoneNumber,
//         email,
//         userId: user.id,
//       },
//     });

//     return {
//       success: "Billing Details added !",
//       data: addBillingDetails,
//     };
//   } catch (error) {
//     console.log("error", error);
//     return {
//       error: `${error}`,
//     };
//   }
// };

export const billingDetails = async (options: billingDetailsProps) => {
  try {
    const { name, phoneNumber, email } = options;

    const user: any = await currentUser();

    if (!name || !phoneNumber || !email) {
      return {
        error: "Fields are required!",
      };
    }

    // Check for existing billing details
    const existingBillingDetails = await db.billingDetails.findUnique({
      where: {
        email: user.email,
      },
    });

    // If billing details exist, you can return them or update them
    if (existingBillingDetails) {
      // Here you can also update the existing record if needed
      // For example, you might want to update the details if they are different
      // You would do that with db.billingDetails.update({...})

      return {
        success: "Existing billing details found.",
        data: existingBillingDetails,
      };
    } else {
      // Create new billing details
      const addBillingDetails = await db.billingDetails.create({
        data: {
          name,
          phoneNumber,
          email,
          userId: user.id,
        },
      });

      return {
        success: "Billing Details added!",
        data: addBillingDetails,
      };
    }
  } catch (error: any) {
    // Checking for unique constraint violation
    if (
      error.message.includes("Unique constraint failed") ||
      error.code === "P2002"
    ) {
      // Replace with your DB's specific error code or message
      return {
        error:
          "This email is already in use in billing details. Please use a different email.",
      };
    }
    console.log("error", error);
    return {
      error: `Error processing request: ${error.message}`,
    };
  }
};

export const getBillingDetails = async (id: string) => {
  try {
    if (!id) {
      return {
        error: "User ID is required",
      };
    }

    const detail = await db.billingDetails.findFirst({
      where: {
        userId: id,
      },
    });

    if (!detail) {
      return {
        error: "Billing Details not found",
      };
    }

    return {
      success: "Billing Details fetched",
      data: detail,
    };
  } catch (error) {
    return {
      error: `unable to fetch data ${error}`,
    };
  }
};

export const getAllBillingDetails = async (id: string) => {
  try {
    if (!id) {
      return {
        error: "User ID is required",
      };
    }

    const detail = await db.billingDetails.findMany({
      where: {
        userId: id,
      },
    });

    if (!detail) {
      return {
        error: "Billing Details not found",
      };
    }

    return {
      success: "Billing Details fetched",
      data: detail,
    };
  } catch (error) {
    return {
      error: `unable to fetch data ${error}`,
    };
  }
};
