import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/db";
import logger from "./config/logger";

const PORT = process.env.PORT || 2000;

const server = async () => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`server has been running on ${PORT}`);
  });
};

server();
