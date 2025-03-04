import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


export default class Token {

    public static generateAccessToken(id: string) {
        return jwt.sign({ id }, process.env.ACCESS_TOKEN as Secret, { expiresIn: process.env.ACCESS_EXPIRY as any });
    }

    public static generateRefreshToken(id: string) {
        return jwt.sign({ id }, process.env.REFRESH_TOKEN as Secret, { expiresIn: process.env.REFRESH_EXPIRY as any });
    }
}