import Redis from "ioredis";
import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config({
  path: "./.env",
});

if (!process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.REDIS_PASSWORD) {
  throw new Error("Missing Redis environment variables: REDIS_HOST, REDIS_PORT, REDIS_PASSWORD");
}

export const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME || "default",
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    if (times > 5) return null; 
    return Math.min(times * 200, 3000);
  },
};

//@ts-ignore
export const redisClient = new Redis(connection);

redisClient.on("connect", () => console.log("Redis connected successfully"));
redisClient.on("error", (err: Error) => console.error("Redis error:", err.message));

export const pub = createClient({
  url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

pub.on("error", (err) => console.error("Pub client error:", err.message));

Promise.all([pub.connect()])
  .then(() => console.log("Pub clients connected"))
  .catch((err) => console.error("Error connecting pub clients:", err));

export default redisClient;