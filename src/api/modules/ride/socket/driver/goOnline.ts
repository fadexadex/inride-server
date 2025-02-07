import { Socket } from "socket.io";
import { IDriver } from "utils/types";
import { addDriverToRedis } from "../../helpers";

const goOnline = async (socket: Socket, driver: IDriver) => {
  try {
    await addDriverToRedis(driver);

    socket.join(`room:${driver.driverId}`);

    socket.broadcast.emit("newDriverOnline", driver);

    socket.emit("goOnlineSuccess", {
      success: true,
      message: "You are now online!",
      driver,
    });
  } catch (error) {
    console.error("Error adding driver to Redis:", error);
    socket.emit("goOnlineFailure", {
      success: false,
      message: "Failed to go online",
      error: error.message,
    });
  }
};

export default goOnline;
