import express from "express";
import "dotenv/config";
import { requestLogger } from "./middleware/global.middleware";
import router from "./routes/auth.routes";
import cors from "cors";
import { errorHandler } from "./middleware/error.handler";
import profileRouter from "./routes/profile.routes";
import bookRouter from "./routes/book.routes";
import helmet from "helmet";
import { apiLimiter } from "./middleware/ratelimiter";

const app = express();
app.use(helmet());
const corsOptions = {};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.get("/" , (req , res) =>{
    res.status(200).json({
        status : 200,
        message : "server is running successfully"
    })
});

app.use("/api", apiLimiter);
app.use("/uploads", express.static("uploads"));

app.use("/api", router);
app.use("/api", profileRouter);
app.use("/api", bookRouter);

app.use(errorHandler);

export default app;
