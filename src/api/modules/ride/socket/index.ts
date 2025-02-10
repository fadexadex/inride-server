import { Server, Socket } from "socket.io";
import goOnline from "./driver/goOnline";
import getOnlineDrivers from "./driver/getOnlineDrivers";
import requestRide from "./rider/requestRide";
import handleRideResponse from "./handleRideResponse";
import {
  removeDriverOrRiderSocketId,
  storeDriverOrRiderSocketId,
} from "../helpers";

export const socketHandler = (io: Server) => {
  io.on("connection", async (socket: Socket) => {
    console.log("A user connected:", socket.id);
    const { role, userId } = socket.handshake.query;
    if (typeof userId === "string" && typeof role === "string") {
      await storeDriverOrRiderSocketId(socket.id, userId, role);
    }

    // ──► Driver goes online
    socket.on("goOnline", async (driver) => {
      goOnline(socket, driver);
    });

    // ──► Rider requests list of online drivers
    socket.on("getOnlineDrivers", () => {
      getOnlineDrivers(socket);
    });

    // ──► Rider sends a ride request to a driver
    socket.on("rideRequest", ({ driverId, riderId, rideDetails }) => {
      requestRide(io, socket, driverId, riderId, rideDetails);
    });

    // ──► Driver responds to ride request
    socket.on("rideResponse", (data) => {
      handleRideResponse(io, socket, data);
    });

    // ──► Ride confirmed: both parties join the ride room
    socket.on("rideConfirmed", ({ rideId }) => {
      const rideRoom = `ride:${rideId}`;
      socket.join(rideRoom);
      socket.emit("joinedRideRoom", { rideRoom });
      console.log(`Socket ${socket.id} joined ride room ${rideRoom}`);
    });

    // ──► Streaming location updates within the ride room
    socket.on("locationUpdate", ({ rideId, role, location }) => {
      const rideRoom = `ride:${rideId}`;
      io.to(rideRoom).emit("locationUpdate", { role, location });
    });

    // ──► Handle disconnection
    socket.on("disconnect", async () => {
      console.log("A user disconnected:", socket.id);
      const { role, userId } = socket.handshake.query;
      if (typeof userId === "string" && typeof role === "string") {
        await removeDriverOrRiderSocketId(userId, role);
      }
    });
  });
};
