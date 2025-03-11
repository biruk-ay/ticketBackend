import { Types } from "mongoose";
import MongoRepository from "../../../lib/repository/mongo.repository.js";
import { ITicket, TicketModel } from "../model/ticket.model.js";

class TicketRepository extends MongoRepository<ITicket> {
    constructor() {
        super(TicketModel);
    }
 
    public async createData(resource: ITicket) {
        try {
            const document = new this.model(resource);
            if (!document) throw new Error("Ticket creation failed");
            await document.save();
            return document;
        } catch (error) {
            console.error("Error Saving Ticket:", error);
            throw new Error("Database error while saving ticket");
        }
    }

    public async readData(id: string) {
        const result = await this.model.findById(id);
        return result;
    }


    public async updateData(id: string, resource: ITicket) {
        const result = await this.model.findByIdAndUpdate(id, resource);
        if (!result) {
            throw new Error(`Resource with ${id} not found for updating`)
        }
    
    }
    public async deleteData(id: string) {
        const result = await this.model.findByIdAndDelete(id);
        if (!result) {
            throw new Error(`Resource with ${id} not found for deleting`);
        }
    }
    public async readByOwner(id: string) {
        const result = await this.model.find({ owner: new Types.ObjectId(id) });
        if (!result.length) {
            throw new Error(`No products found for owner ID ${id}`);
        }
        return result;
    }
    public async updateStatus(id: string, resource: string) {
        const result = await this.model.findByIdAndUpdate(id, { status: resource });
        if (!result) {
            throw new Error(`Resource with ${id} not found for updating`)
        }
        return result;
    }
    public async readAll() {
        return await this.model.find();
    }
}

export default new TicketRepository;