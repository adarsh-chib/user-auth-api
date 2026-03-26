import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 2000;

const server = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`server has been running on ${PORT}`);
  });
};

server();
