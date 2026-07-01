import Redis from "ioredis";
import dotenv from "dotenv";

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

export default redisClient;