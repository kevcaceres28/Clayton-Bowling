"use server";
import nodemailer from "nodemailer"; // Assuming nodemailer is being used
import { mailOptions, transporter } from "./nodemailer";

// Function to generate the email content
// const generateEmailContent = (reservationDetails: any) => {
//   return `
//     <p>Dear ${reservationDetails.userName},</p>
//     <p>This is the confirmation of your reservation.</p>
//     <p>You have reserved <strong>${reservationDetails.reservationItem}</strong> for ${reservationDetails.reservationDate} from ${reservationDetails.startTime} to ${reservationDetails.endTime}</p>

//     <p>The rental value for the Court is: <strong>$${reservationDetails.rentalValue}</strong></p>
//     <p>The value of: <strong>$${reservationDetails.additionalCharges}</strong></p>
//     <p>The total is: <strong>$${reservationDetails.total}</strong></p>

//     <p>We will be waiting for you at ${reservationDetails.location}, on ${reservationDetails.reservationDate} at ${reservationDetails.startTime}.</p>
//     <p>Thanks for trusting us.</p>

//     <p><strong>Bowling Planet Panama</strong><br>
//     ${reservationDetails.location}<br>
//     <a href="${reservationDetails.website}">${reservationDetails.website}</a></p>

//     <p>If you want you can cancel the reservation from this <a href="${reservationDetails.cancellationLink}">link</a>.</p>
//   `;
// };
const generateEmailContent = (reservationDetails: any) => {
  let itemsHtml = reservationDetails.items
    .map(
      (item: any) => `
      <p><strong>${item.serviceName}</strong> - ${item.date} at ${item.time}
      <br>Price: $${item.price}
      ${item.extraPrice ? `<br>Extra: $${item.extraPrice}` : ""}
      <br><a href="${item.cancelationLink}">Cancel Reservation</a></p>
    `
    )
    .join("");

  return `
      <p>Dear ${reservationDetails.userName},</p>
      <p>This is the confirmation of your reservations:</p>
      ${itemsHtml}
      <p>Total: <strong>$${reservationDetails.total}</strong></p>
      <p>Thanks for trusting us.</p>
      <p><strong>Your Company Name</strong></p>
      <!-- Add more details like location or website if needed -->
    `;
};

// Email send function
const emailsend = async (reservationDetails: any, recipient: any) => {
  const emailContent = generateEmailContent(reservationDetails);

  const finalMailOptions = {
    ...mailOptions, // Assuming mailOptions is predefined with sender details
    html: emailContent,
    to: recipient,
    subject: `Reservation Confirmation - ${reservationDetails.reservationItem}`,
  };

  try {
    const info = await transporter.sendMail(finalMailOptions);
    console.log("Email sent:", info);
  } catch (error) {
    console.error("Email error:", error);
  }
};

// emailsend(reservationDetails, 'recipient@example.com');

export async function sendReservationEmail(
  reservationDetails: any,
  recipientEmail: any
) {
  try {
    await emailsend(reservationDetails, recipientEmail);
    console.log("Email sent successfully.");
    // You can add more code here if needed after the email is sent
  } catch (error) {
    console.error("Failed to send email:", error);
    // Handle error appropriately
  }
}
