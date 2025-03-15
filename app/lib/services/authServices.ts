import { DataSource } from "typeorm";
import { User } from "@/db/entities/User";
import { Repository } from "typeorm";
// import { generateOTP , checkValidity } from "../utils/auth";
import { AppDataSource } from "@/db/data-source";
import { sendlinkToUser } from "../utils/auth";
import { promises } from "dns";
import jwt from "jsonwebtoken";

interface registerResponce {
  success: boolean;
  message: string;
  data: User;
}

interface loginResponce {
  success: boolean;
  message: string;
  token?: string;
}


interface verifyResponce{
    success:boolean,
    message:string,
    token?:string,
    cookies?:string,
    jwtToken?:string,
}

interface verifyData{
    token:string,
}

interface registerData {
  name:string,
  email: string;
}
interface loginData {
  email: string;
}

export class AuthService {
  private user: Repository<User>;

  constructor() {
    this.user = AppDataSource.getRepository(User);
  }

  async register({ name , email }: registerData): Promise<registerResponce> {
    let user = await this.user.findOne({ where: { email } });

    if (!user) {
      user = this.user.create({ name:name , email:email });
      await this.user.save(user);

      return {
        success: true,
        message: "User registered Sucsessfully Please Login.",
        data: user,
      };
    }
    
    return {
      success: true,
      message: "User Already registered Please Login.",
      data: user,
    };
  }

  async login({ email  }: loginData): Promise<loginResponce> {
    let user = await this.user.findOne({ where: { email } });


    if (!user) {
      return {
        success: false,
        message: "Please Register With your active email First",
      };
    }

    await sendlinkToUser(email);

    return { success: true, message: "Link Sent successfully. Please Verify" };
  }


  async verify({token}:verifyData):Promise<verifyResponce>{

    const user = await this.user.findOne({where:{verificationToken: token }})

    if(!user){
        return {
            success:false,
            message:"please Verify Link or request new Link"
        }
    }

    if (!user || !user.verificationTokenExpiresAt || new Date() > user.verificationTokenExpiresAt) {
        return {
            success:false,
            message:"Token expired, please request new link"
        }
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await this.user.save(user);

    const jwtToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role }, 
        process.env.JWT_SECRET as string, 
        { expiresIn: "7d" }
      );
      
    return {
        success:true,
        message:"Email verified successfully",
        token:jwtToken,
    }
  }

}