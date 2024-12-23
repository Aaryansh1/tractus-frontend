/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
let io: any;

export const getIOInstance = (server: any) => {
  if (!io) {
    const { Server } = require("socket.io");
    io = new Server(server);
  }
  return io;
};
