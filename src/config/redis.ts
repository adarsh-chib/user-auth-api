import { createClient } from "redis";
import logger from "./logger";
import { error } from "node:console";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = createClient({
    url : redisUrl,
});

redisClient.on("error",(error)=>{
    logger.error("Redis connection error", error);
});

redisClient.on("connect", ()=>{
    logger.info("Redis connected successfully");
})

export const connectRedis = async ()=>{
    try{
    await redisClient.connect();
}
catch(errro){
    logger.error("Redis startup failed", error);
    throw error;
}
}