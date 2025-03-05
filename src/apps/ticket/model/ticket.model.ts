import mongoose, { Document, model, Schema } from "mongoose";
import { IUser } from "../../auth/model/user.model.js";

interface ITicket extends Document {
    owner: IUser['_id'];
    title: string;
    description: string;
    status: string;
}

export const TicketSchema = new Schema({
    owner:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: false},
    title: { type: String, required: true},
    description: { type: String, required: true },
    status: { type: String, enum:['Open', 'InProgress', 'Closed'], default: 'Open', required: true}
});

const TicketModel = model<ITicket>('Ticket', TicketSchema);

export { ITicket, TicketModel };