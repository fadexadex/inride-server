import { Server, Socket } from "socket.io";
import { fetchAllOnlineDrivers, addDriverToRedis } from "../helpers";
import { IDriver } from "utils/types";

export const socketHandler = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    //riders event listeners
    socket.on("getOnlineDrivers", async () => {
      try {
        const drivers = await fetchAllOnlineDrivers();
        socket.emit("onlineDrivers", { success: true, drivers });
      } catch (error) {
        console.error("Error fetching online drivers:", error);
        socket.emit("onlineDrivers", {
          success: false,
          message: "Failed to fetch online drivers.",
        });
      }
    });
    //drivers event listeners
    socket.on("goOnline", async (driver: IDriver) => {
      try {
        await addDriverToRedis(driver);
        socket.broadcast.emit("newDriverOnline", driver);
      } catch (error) {
        console.error("Error adding driver to Redis:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
