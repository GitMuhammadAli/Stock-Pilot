import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_host,
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sendVerificationLink = async (email: string, verificationLink: string) => {
  try {
    console.log(process.env.MAILTRAP_USER)
    console.log(email,verificationLink)
    const info = await transporter.sendMail({
      from: '"Inventory Management System" <no-reply@inventorymanager.com>',
      to: email,
      subject: "Welcome to Stock Pilot - Verify Your Account",
      text: `Thank you for choosing Stock Pilot! Please click on this link to verify your account: ${verificationLink}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h1 style="color: #2c3e50; text-align: center;">Welcome to Stock Pilot!</h1>
          <p style="color: #34495e; font-size: 16px; line-height: 1.5;">Thank you for choosing our inventory management solution. To get started, please verify your account by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #B9F900; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Your Account</a>
          </div>
          <p style="color: #7f8c8d; font-size: 14px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="color: #7f8c8d; font-size: 14px; word-break: break-all;">${verificationLink}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #95a5a6; font-size: 12px; text-align: center;">This is an automated message, please do not reply to this email.</p>
        </div>
      `,
    });
    
    console.log("Email sent: %s", info.messageId);
    return verificationLink;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};
