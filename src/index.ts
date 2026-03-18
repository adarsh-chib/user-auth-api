import express, { Router } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import { connectDB } from "./config/db";
import {
  requestLoggger,
} from "./middleware/global.middleware";
import router from "./routes/auth.routes";
import cors from "cors";
import { errorHandler } from "./middleware/error.handler";

const app = express();
const corsOptions = {
  origin: "http://localhost:4000", // Replace with your exact frontend URL
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 2000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLoggger);


app.use("/api", router);
app.use(errorHandler);

const server = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`server has been running on ${PORT}`);
  });
};

server();
