import { fetchAllOnlineDrivers } from "../../helpers";
import { Socket } from "socket.io";
const getOnlineDrivers = async (socket: Socket) => {
  try {
    const drivers = await fetchAllOnlineDrivers();
    socket.emit("onlineDrivers", { success: true, drivers });
  } catch (error) {
    console.error("Error fetching online drivers:", error);
    socket.emit("onlineDrivers", {
      success: false,
      message: "Failed to fetch online drivers.",
      error: error.message,
    });
  }
};

export default getOnlineDrivers