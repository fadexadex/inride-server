import { createClient, RedisClientType } from "@redis/client";
import dotenv from "dotenv";

dotenv.config();

class RedisService {
  client: RedisClientType;
  constructor(
    password: string | undefined,
    host: string | undefined,
    port: number
  ) {
    this.client = createClient({
      password,
      socket: {
        host,
        port,
      },
    });
  }

  async createConnection(): Promise<void> {
    this.client.on("ready", () => {
      console.info("Redis store connected");
    });
    this.client.on("error", (err) => {
      console.error("Redis is disconnected: ", err);
    });
    try {
      await this.client.connect();
    } catch (err) {
      console.error("Error while connecting to redis store: ", err);
    }
  }
}

const redisService = new RedisService(
  process.env.REDIS_SECRET,
  process.env.REDIS_HOST,
  Number(process.env.REDIS_PORT)
);

export const initializeRedis = async () => {
  await redisService.createConnection();
};

export default redisService;
