import { Server, Socket } from "socket.io";
import { fetchAllOnlineDrivers, addDriverToRedis } from "../helpers";
import { IDriver } from "utils/types";

export const socketHandler = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    socket.on("getOnlineDrivers", async () => {
      const drivers = await fetchAllOnlineDrivers();
      socket.emit("onlineDrivers", drivers);
    });

    socket.on("goOnline", (driver: IDriver) => {
      addDriverToRedis(driver);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
