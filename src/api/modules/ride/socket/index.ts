import { Server, Socket } from "socket.io";

export const socketHandler = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    //what happens when a driver goes online
        //we store the current location of the driver and we create a room for him with his socket id

    socket.on("goOnline", ({driverId, longitude, latitude}) => {
      console.log("Received example_event:", data);
      socket.emit("example_response", { success: true });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
