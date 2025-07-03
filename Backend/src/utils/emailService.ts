//utils/emailService.ts
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
  name: string = "User",
  subject: string = "Mentor One OTP Verification",
  html?: string
) => {
  const CLIENT_HOST_URL =
    process.env.CLIENT_HOST_URL || "https://mentorone.com";

  // Default HTML template for OTP or general emails
  const defaultHtml = `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
  <div style="background-color: #4A90E2; padding: 25px 20px; text-align: center;">
    <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Mentor One</h1>
  </div>

  <div style="padding: 30px 40px;">
    <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 20px;">
      Dear ${name},
    </p>
    <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 20px;">
      ${text}
    </p>
    <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 30px;">
      We're here to help you achieve your goals. If you have any questions or need assistance, don't hesitate to reach out!
    </p>
    <div style="text-align: center; margin-top: 30px;">
      <a href="${CLIENT_HOST_URL}" style="display: inline-block; background-color: #4A90E2; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-size: 18px; font-weight: bold;">Visit Our Website</a>
    </div>
  </div>

  <div style="background-color: #f7f7f7; padding: 20px 40px; text-align: center; font-size: 13px; color: #888888; border-top: 1px solid #eeeeee;">
    <p style="margin: 0;">© ${new Date().getFullYear()} Mentor One. All rights reserved.</p>
    <p style="margin-top: 8px;"><a href="${CLIENT_HOST_URL}" style="color: #4A90E2; text-decoration: none;">MentorOne.com</a></p>
  </div>
</div>
  `;

  const mailOptions = {
    from: process.env.OTP_EMAIL,
    to,
    subject,
    text,
    html: html || defaultHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return info.response;
  } catch (error) {
    console.error("Error sending email:", error);
    return null;
  }
};
