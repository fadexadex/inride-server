import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import { initializeRedis } from "./utils/redis";
import authRoutes from "./api/modules/auth/routes";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./api/modules/ride/socket";

dotenv.config();

export class AppServer {
  private app: express.Application;
  private port: number;
  private server: http.Server;
  private io: Server;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server);
  }

  private enableMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setUpRoutes() {
    this.app.use("/api/auth", authRoutes);
    this.app.use(errorHandler);
  }

  private setUpSocket() {
   socketHandler(this.io)
  }

  private startRedis() {
    initializeRedis();
  }

  public startApp() {
    this.enableMiddlewares();
    this.setUpRoutes();
    this.setUpSocket();
    // this.startRedis();
    this.server.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
