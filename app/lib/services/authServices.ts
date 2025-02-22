import { DataSource } from "typeorm";
import { User } from "@/db/entities/User";
import { Repository } from "typeorm";
import { generateOTP , checkValidity } from "../utils/auth";
import { AppDataSource } from "@/db/data-source";



interface registerResponce {
    success:boolean;
    message:string
    data:User
}


interface loginResponce {
    success: boolean;
    message:string;
    token?:string
}



interface registerData {
    email:string
}


export class AuthService {
    private user:Repository<User>

    constructor() {
        this.user = AppDataSource.getRepository(User);
    }


    async register({email}:registerData): Promise<registerResponce> {
        let user = await this.user.findOne({ where: { email } });

        if (!user) {
          user = this.user.create({ email });
          await this.user.save(user);
        }
    
        return { success: true, message: "User registered successfully. Please request Otp At login" , data : user };
        
    }
}