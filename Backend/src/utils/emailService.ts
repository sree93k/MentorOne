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

export const createContactResponseEmailTemplate = (
  userName: string,
  originalSubject: string,
  adminResponse: string,
  originalMessage: string
): string => {
  const CLIENT_HOST_URL =
    process.env.CLIENT_HOST_URL || "https://mentorone.com";

  return `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
  <!-- Header -->
  <div style="background-color: #4A90E2; padding: 25px 20px; text-align: center;">
    <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Mentor One</h1>
    <p style="color: #ffffff; font-size: 14px; margin: 5px 0 0 0; opacity: 0.9;">Support Team Response</p>
  </div>

  <!-- Main Content -->
  <div style="padding: 30px 40px;">
    <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 20px;">
      Dear ${userName},
    </p>
    
    <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 25px;">
      Thank you for contacting MentorOne Support. We've reviewed your inquiry and have a response for you.
    </p>

    <!-- Original Message Context -->
    <div style="background-color: #f8f9fa; border-left: 4px solid #4A90E2; padding: 20px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
      <h3 style="color: #4A90E2; font-size: 16px; margin: 0 0 10px 0;">Your Original Message:</h3>
      <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">Subject: ${originalSubject}</p>
      <p style="color: #666666; font-size: 14px; margin: 0; line-height: 1.5;">${originalMessage}</p>
    </div>

    <!-- Admin Response -->
    <div style="background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
      <h3 style="color: #333333; font-size: 16px; margin: 0 0 15px 0;">MentorOne Support Response:</h3>
      <div style="color: #333333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${adminResponse}</div>
    </div>

    <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 20px;">
      If you have any follow-up questions or need further assistance, please don't hesitate to reach out to us again.
    </p>

    <!-- CTA Button -->
    <div style="text-align: center; margin-top: 30px;">
      <a href="${CLIENT_HOST_URL}/contact" style="display: inline-block; background-color: #4A90E2; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-size: 16px; font-weight: bold;">Contact Us Again</a>
    </div>
  </div>

  <!-- Footer -->
  <div style="background-color: #f7f7f7; padding: 20px 40px; text-align: center; font-size: 13px; color: #888888; border-top: 1px solid #eeeeee;">
    <p style="margin: 0 0 8px 0;">Best regards,<br><strong>MentorOne Support Team</strong></p>
    <p style="margin: 0;">© ${new Date().getFullYear()} Mentor One. All rights reserved.</p>
    <p style="margin-top: 8px;"><a href="${CLIENT_HOST_URL}" style="color: #4A90E2; text-decoration: none;">MentorOne.com</a></p>
  </div>
</div>
  `;
};
