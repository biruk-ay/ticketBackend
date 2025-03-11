import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { IUser, UserModel } from "../model/user.model.js";

interface AuthRequest extends Request {
    user?: {
        id: string;
        name: string;
        email: string;
        role: string;
    }
}

interface DecodedToken extends JwtPayload {
    id: string;
}

const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];
    console.log(token);
    if (!token) return void res.status(401).json({ message: "Unauthenticated" });

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN as string) as DecodedToken;
        const user = await UserModel.findById(decoded.id).select("-password");
        if (!user) {
            return void res.status(404).json({ message: "User not found" });
        }

        req.user = {
            id : user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        next();
    } catch {
        res.status(403).json({ result: "Invalid token"});
    }
}

const authorize = (roles: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = await UserModel.findById(req.user?.id);
        if(!user || !roles.includes(user.role)) {
            return void res.status(403).json({ message: "Unauthorized"});
        }
        next();
    };  
};

export { authenticate, authorize, AuthRequest };