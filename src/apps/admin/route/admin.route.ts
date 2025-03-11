import { Router } from "express";
import { Response } from "express";
import { TicketModel } from "../../ticket/model/ticket.model.js";
import { AuthRequest } from "../../auth/middleware/auth.middleware.js";
import ticketRepository from "../../ticket/repository/ticket.repository.js";

const adminRouter = Router();

const update = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return void res.status(401).json({ message: "Unauthenticated" });
    }
    const { status, id } = req.body;
    try {
        const result = await ticketRepository.updateStatus(id, status);
        return void res.status(200).json({"Updated: ": result});
    } catch (error) {
        res.status(500).json({ error: "Internal server error"});
    }
}

const allTicketsAdmin = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return void res.status(401).json({ message: "Unauthenticated" });
    }

    try {
        const result = await ticketRepository.readAll();
        return void res.status(200).json({ results: result });
    } catch (error) {
        res.status(500).json({ error: "Internal server error"});
    }
}

adminRouter.put("/tickets", update);
adminRouter.get("/tickets", allTicketsAdmin);

export { adminRouter }