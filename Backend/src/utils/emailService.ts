import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.OTP_EMAIL,
    pass: process.env.OTP_EMAIL_PASSWORD,
  },
});

export const sendMail = async (
  to: string,
  text: string,
  subject?: string,
  html?: string
) => {
  const mailOptions = {
    from: process.env.OTP_EMAIL,
    to,
    subject: subject || "Mentor One OTP Verification",
    text,
    html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return info.response;
  } catch (error) {
    console.error("OTP sending error", error);
    return null;
  }
};
