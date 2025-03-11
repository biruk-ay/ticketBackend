import * as dotenv from 'dotenv';
import express, { Router } from 'express';
import { connectDB } from './configs/db.js';
import cors from 'cors';
import authRouter from './apps/auth/route/auth.route.js';
import cookieParser, { JSONCookie } from 'cookie-parser';
import { authenticate, authorize } from './apps/auth/middleware/auth.middleware.js';
import { ticketRouter } from './apps/ticket/route/ticket.route.js';
import { adminRouter } from './apps/admin/route/admin.route.js';
import { JsonWebTokenError } from 'jsonwebtoken';

dotenv.config();

const PORT  = process.env.PORT;
const app = express();

connectDB();
app.use(express.json());
app.use('/', cors({
  origin: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true
}));
app.use(cookieParser());


app.use("/auth", authRouter);
app.use("/ticket", authenticate, ticketRouter);
app.use("/admin", authenticate, authorize(["admin"]), adminRouter);
app.get("/", (req, res) => {
  res.send("Deployment Successful");
})

if (!PORT) {
  console.error("PORT is not defined in .env file");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});