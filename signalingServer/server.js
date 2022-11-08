import { Server } from "socket.io";

const io = new Server(3000);

io.on("connection", (socket) => {
  socket.on("join_room", ({roomId, userId}) => {
    console.log();
    if(room)
  });
});
