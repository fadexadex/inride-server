import { AppServer } from "./appController";

const port: number = Number(process.env.PORT) || 3000;

const server = new AppServer(port);
server.startApp();