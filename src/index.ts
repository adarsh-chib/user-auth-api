import express, { Router } from "express";
import "dotenv/config";
import { connectDB } from "./config/db";
import { requestLogger } from "./middleware/global.middleware";
import router from "./routes/auth.routes";
import cors from "cors";
import { errorHandler } from "./middleware/error.handler";
import profileRouter from "./routes/profile.routes";
import bookRouter from "./routes/book.routes";

const app = express();
const corsOptions = {
  origin: "http://localhost:4000", // Replace with your exact frontend URL
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 2000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use("/uploads", express.static("uploads"));

app.use("/api", router);
app.use("/api", profileRouter);
app.use("/api", bookRouter);

app.use(errorHandler);

const server = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`server has been running on ${PORT}`);
  });
};

server();
