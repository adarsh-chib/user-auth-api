import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/db";
import logger from "./config/logger";
import { connectRedis } from "./config/redis";

const PORT = process.env.PORT || 2000;

const server = async () => {
  try{
  await connectDB();
  await connectRedis();

  app.listen(PORT, () => {
    logger.info(`server has been running on ${PORT}`);
  });
  }
  catch(error){
    logger.error("server startup failed", error)
    process.exit(1);
  }
};

server();
