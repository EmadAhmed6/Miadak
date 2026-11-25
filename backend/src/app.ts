import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import type { Express } from "express";
import connectToDB from "./config/db.js";
import { errorHandler, notFound } from "./middlewares/errors.js";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";

dotenv.config();
const app: Express = express();
connectToDB();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
