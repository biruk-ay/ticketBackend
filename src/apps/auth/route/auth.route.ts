import { Router } from "express";
import { Request, Response } from "express";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authRepository from "../repository/auth.repository.js";
import { UserModel } from "../model/user.model.js";
import Token from "../../../lib/utils/token.js";

dotenv.config();
const authRouter = Router();

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await authRepository.readData(email);
    if (user) return void res.status(409).json({ error: "user already exists" });
    const hashedPassword = hash(password, 10);
    const newUser = new UserModel({
      role,
      name,
      email,
      hashedPassword,
    });
    const result = await authRepository.createData(newUser);
    const accessToken = Token.generateAccessToken(result._id as string);
    const refreshToken = Token.generateRefreshToken(result._id as string);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return void res.status(200).json({
      role: result.role,
      name: result.name,
      email: result.email,
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await authRepository.readData(email);
    if (!user) return void res.status(400).json({ error: "Invalid Credential" });

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch)
      return void res.status(400).json({ error: "Invalid Credential" });

    const accessToken = Token.generateAccessToken(user._id as string);
    const refreshToken = Token.generateRefreshToken(user._id as string);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return void res.status(200).json({
      role: user.role,
      name: user.name,
      email: user.email,
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return void res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN as string
    ) as { id: string };
    const newAccessToken = Token.generateAccessToken(payload.id);
    return void res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.json(403).json({ error: "Invalid refresh token" });
  }
};

const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  return void res.status(200).json({ result: "Logged Out" });
};

authRouter.post("/register", registerUser);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);

export default authRouter;