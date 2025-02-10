import { Server, Socket } from "socket.io";
import redisService from "../../../../../utils/redis";
import { IRequestDetails } from "utils/types";
import { getSocketId } from "../../helpers";

const requestRide = async (
  io: Server,
  socket: Socket,
  driverId: string,
  riderId: string,

  requestDetails: IRequestDetails
) => {
  try {
    const temporaryLockKey = `driver:lock${driverId}`;
    const driverIsLocked = await redisService.client.get(temporaryLockKey);
    console.log("Driver is locked:", driverIsLocked);
    if (driverIsLocked) {
      throw new Error("Driver is already booked or pending another request");
    }
    await redisService.client.set(temporaryLockKey, riderId, {
      EX: 30,
    });

    const driverSocketId = await getSocketId("driver", driverId);
    console.log("Driver socket ID:", driverSocketId);

    io.to(driverSocketId).emit("incomingRequest", {
      message: "New ride request",
      requestDetails,
      riderId,
    });

    const riderSocketId = await getSocketId("rider", riderId);
    console.log("Rider socket ID:", riderSocketId);

    io.to(riderSocketId).emit("rideRequestPending", {
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
