import { sendOtpEmail } from "./sendOtp";

export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  export const checkValidity = (otpExpiresAt: Date | null): boolean => {
    if (!otpExpiresAt) return false;
    return new Date() < otpExpiresAt;
  };
  

  export const sendOtpToUser = async (email: string) => {
    const otp = generateOTP();
    await sendOtpEmail(email, otp);
    return otp;
 }