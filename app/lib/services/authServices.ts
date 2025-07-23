import { User } from "@/db/entities/User";
import { Repository } from "typeorm";
import { AppDataSource } from "@/db/data-source";
import { sendVerificationLink } from "../utils/VerificationLink";
import { signJwt } from '@/lib/utils/jwt';
import crypto from 'crypto';
import { connectDB } from "@/db/connectDb";

interface RegisterResponse {
  success: boolean;
  message: string;
  data?: User;
}

interface LoginResponse {
  success: boolean;
  message: string;
}

interface VerifyResponse {
  cookies?: any;
  success: boolean;
  message: string;
  token?: string;
}

interface VerifyData {
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
}

interface LoginData {
  email: string;
}

export class AuthService {
  private userRepo: Repository<User>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
  }

  async register({ name, email }: RegisterData): Promise<RegisterResponse> {
    try {
      let user = await this.userRepo.findOne({ where: { email } });

      if (user) {
        return {
          success: true,
          message: "User already registered. Please login.",
          data: user,
        };
      }

      user = this.userRepo.create({ name, email });
      await this.userRepo.save(user);

      return {
        success: true,
        message: "User registered successfully. Please login.",
        data: user,
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "An error occurred during registration.",
      };
    }
  }

  /**
   * Checks if a user exists by email or id.
   * @param identifier - email or id of the user
   * @returns The user object if found, otherwise null.
   */
  async userExists(identifier: { email?: string; id?: string }): Promise<User | null> {
    try {
      if (!AppDataSource.isInitialized) {
        await connectDB(); // Use the centralized initialization
      }

      let query = this.userRepo.createQueryBuilder("user");
      
      if (identifier.email) {
        query = query.where("user.email = :email", { email: identifier.email });
      } else if (identifier.id) {
        query = query.where("user.id = :id", { id: identifier.id });
      }

      const user = await query.getOne();
      console.log("Queried User:", user);
      return user;
    } catch (error) {
      console.error("userExists error:", error);
      throw error; // Rethrow to handle in middleware
    }
  }
  async login({ email }: LoginData): Promise<LoginResponse> {
    try {
      let user = await this.userRepo.findOne({ where: { email } });
      console.log("i am login " , user)
      if (user == null) {
        return {
          success: false,
          message: "Please register with your active email first.",
        };
      }

      const token = crypto.randomBytes(32).toString('hex');
      user.verificationToken = token;
      user.verificationTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      await this.userRepo.save(user);

      const baseUrl = process.env.PORT_LINK || 'http://localhost:7700';
      const verificationLink = `${baseUrl}/api/auth/verify?token=${token}`;

      await sendVerificationLink(email, verificationLink);

      return { 
        success: true, 
        message: "Verification link sent to your email. Please check your inbox." 
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "An error occurred while sending the verification link.",
      };
    }
  }

  async verify({ token }: VerifyData): Promise<VerifyResponse> {
    try {
      const user = await this.userRepo.findOne({ 
        where: { verificationToken: token } 
      });

      if (!user) {
        return { success: false, message: "Invalid verification token."  };
      }

      if (!user.verificationTokenExpiresAt || 
          new Date() > user.verificationTokenExpiresAt) {
        return { success: false, message: "Verification token has expired." };
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;
      await this.userRepo.save(user);

      const jwtToken = signJwt({
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      return {
        success: true,
        message: "Email verified successfully.",
        token: jwtToken
      };
    } catch (error) {
      console.error("Verification error:", error);
      return { 
        success: false, 
        message: "An error occurred during verification." 
      };
    }
  }
}