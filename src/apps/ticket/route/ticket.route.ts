import { Router } from "express";
import { Response } from "express";
import { TicketModel } from "../model/ticket.model.js";
import { AuthRequest } from "../../auth/middleware/auth.middleware.js";
import ticketRepository from "../repository/ticket.repository.js";

const ticketRouter = Router();

const create = async (req: AuthRequest, res: Response) => {
    const { title, description, status } = req.body;
    console.log(title, description, status);
    if (!req.user) {
        return void res.status(401).json({ message: "Unauthenticated" });
    }
    const id = req.user.id;
    try {
        const newTicket = new TicketModel({
            owner: id,
            title,
            description,
            status
        });
        const result = await ticketRepository.createData(newTicket);
        return void res.status(200).json({ message: "Ticket created successfully"});
    } catch (error) {
        console.error("Server Error ", error)
        res.status(500).json({ error: "Internal server error"});
    }
}

const allTickets = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return void res.status(401).json({ message: "Unauthenticated" });
    }
    const id = req.user.id;
    try {
        const result = await ticketRepository.readByOwner(id);
        return void res.status(200).json({ results: result })
    } catch(error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

ticketRouter.post("/tickets", create);
ticketRouter.get("/tickets", allTickets);

export { ticketRouter };