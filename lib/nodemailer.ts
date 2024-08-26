import nodemailer, { TransportOptions } from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "mehdim93514@gmail.com",
    pass: "duzgebxzrjimnqbe",
  },
} as TransportOptions);
export const mailOptions = {
  // from: "buybuytelekom@gmail.com",
  from: {
    name: "noreply",
    address: "noreply@esimwe.com",
  },
};
