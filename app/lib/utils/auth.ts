import { AppDataSource } from "@/db/data-source";
import { sendVerificationLink } from "./VerificationLink";
import crypto from 'crypto';
import { User } from "@/db/entities/User";

export const checkValidity = (otpExpiresAt: Date | null): boolean => {
  if (!otpExpiresAt) return false;
  return new Date() < otpExpiresAt;
};

export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateVerificationLink = (baseUrl: string, token: string): string => {
  return `${baseUrl}/api/auth/verify?token=${token}`;
};

export const sendlinkToUser = async (email: string) => {
  const url = process.env.PORT_LINK || "http://localhost:3000";
  if (!url) {
    throw new Error('PORT_LINK environment variable is not defined');
  }

  const userRepo = AppDataSource.getRepository(User);
  let findUser = await userRepo.findOne({where:{email}});
  
  if(!findUser){
    throw new Error('User not found. Please register first.');
  }

  const token = generateVerificationToken();

  findUser.verificationToken = token;
  findUser.verificationTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minute
  await userRepo.save(findUser);

  const verificationLink = generateVerificationLink(url, token);
  await sendVerificationLink(email, verificationLink);
  return verificationLink;
};
