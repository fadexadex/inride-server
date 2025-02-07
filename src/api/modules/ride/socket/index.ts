import { Server, Socket } from "socket.io";
import goOnline from "./driver/goOnline";
import getOnlineDrivers from "./driver/getOnlineDrivers";
import requestRide from "./rider/requestRide";
import handleRideResponse from "./handleRideResponse";
import { storeDriverOrRiderSocketId, takeDriverOffline } from "../helpers";

export const socketHandler = (io: Server) => {
  io.on("connection", async (socket: Socket) => {
    console.log("A user connected:", socket.id);
    // map userId to socket id
    const { role, userId } = socket.handshake.query;
    if (typeof userId === "string" && typeof role === "string") {
      await storeDriverOrRiderSocketId(socket.id, userId, role);
    }

    //riders event listeners
    socket.on("getOnlineDrivers", () => {
      getOnlineDrivers(socket);
    });

    socket.on("rideRequest", ({ driverId, riderId, rideDetails }) => {
      requestRide(io, socket, driverId, riderId, rideDetails);
    });

    //other 
    socket.on("rideResponse", (data) => {
      handleRideResponse(io, socket, data);
    });

    socket.on("rideConfirmed", ({ rideId }) => {
      const rideRoom = `ride:${rideId}`;
      socket.join(rideRoom);
      socket.emit("joinedRideRoom", { rideRoom });
      console.log(`Socket ${socket.id} joined ride room ${rideRoom}`);
    });

    socket.on("locationUpdate", ({ rideId, role, location }) => {
      const rideRoom = `ride:${rideId}`;
      // Broadcast location update to everyone in the ride room
      io.to(rideRoom).emit("locationUpdate", { role, location });
    });


    //drivers event listeners
    socket.on("goOnline", (driver) => {
      goOnline(socket, driver);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
