import { Server, Socket } from "socket.io";
import { IRideResponseData } from "../../../../utils/types";
import { getSocketId } from "../helpers";
import { v4 as uuidv4 } from 'uuid';

const handleRideResponse = async (
  io: Server,
  socket: Socket,
  data: IRideResponseData
) => {
  const { accepted, driverId, riderId, requestDetails } = data;

  try {
    const riderSocketId = await getSocketId("rider", riderId);
    const driverSocketId = await getSocketId(driverId, "driver");

    if (accepted) {

      requestDetails.rideId = uuidv4();

      if (riderSocketId) {
        io.to(riderSocketId).emit("rideConfirmed", {
          message: "Your ride request has been accepted!",
          requestDetails,
        });
      }
      if (driverSocketId) {
        io.to(driverSocketId).emit("rideConfirmed", {
          message: "Ride request accepted successfully.",
          requestDetails,
        });
      }
    } else {
      if (riderSocketId) {
        io.to(riderSocketId).emit("rideRejected", {
          message: "Your ride request was declined by the driver.",
        });
      }
      if (driverSocketId) {
        io.to(driverSocketId).emit("rideRejected", {
          message: "You have declined the ride request.",
        });
      }
    }
  } catch (error) {
    console.error("Error processing ride response:", error);
    socket.emit("rideResponseError", {
      message: "An error occurred while processing your ride response.",
    });
  }
};

export default handleRideResponse;
