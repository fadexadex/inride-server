import { Server, Socket } from "socket.io";
import redisService from "utils/redis";
import { IRequestDetails } from "utils/types";
import { getSocketId } from "../../helpers";

const requestRide = async (
  io: Server,
  socket: Socket,
  riderId: string,
  driverId: string,
  requestDetails: IRequestDetails
) => {
  try {
    const temporaryLockKey = `driver:lock${driverId}`;
    const driverIsLocked = await redisService.client.get(temporaryLockKey);
    if (driverIsLocked) {
      throw new Error("Driver is already booked or pending another request");
    }
    await redisService.client.set(temporaryLockKey, riderId, {
      EX: 30,
    });

    const driverSocketId = await getSocketId(driverId, "driver");

    io.to(driverSocketId).emit("incomingRequest", {
      message: "New ride request",
      requestDetails,
      clientId: socket.id,
    });

    const riderSocketId = await getSocketId("rider", riderId);

    socket.to(riderSocketId).emit("rideRequestPending", {
      message: "Your request has been sent, waiting for driver to accept",
    });
  } catch (error) {
    console.log(error.message);
    return socket.emit("rideRequestFailed", {
      message: error.message,
    });
  }
};

export default requestRide;
