// CREATE this new file to manage Socket.IO instance
import { Server } from "socket.io";

let ioInstance: Server | null = null;

export const setIO = (io: Server): void => {
  ioInstance = io;
  console.log("✅ Socket.IO instance set globally");
};

export const getIO = (): Server => {
  if (!ioInstance) {
    throw new Error("Socket.IO not initialized. Call setIO first.");
  }
  return ioInstance;
};
