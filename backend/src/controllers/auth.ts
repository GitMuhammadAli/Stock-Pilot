import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { UserRole } from "../entity/User";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User();
  user.email = email;
  user.password = hashedPassword;
  user.role = role || UserRole.STAFF;

  await AppDataSource.manager.save(user);
  res.status(201).json({ message: "User created!" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await AppDataSource.getRepository(User).findOneBy({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, { httpOnly: true });
  res.json({ message: "Logged in!" });
};