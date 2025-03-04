import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

const authMiddle = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return void res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN as string);
        (req as any).user = decoded;
        next();
    } catch {
        res.status(403).json({ result: "Invalid token"});
    }
}

export { authMiddle };