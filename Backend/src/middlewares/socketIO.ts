import { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";

// Middleware to attach Socket.IO instance to request
export const attachSocketIO = (io: Server) => {
  return (req: Request, res: Response, next: NextFunction) => {
    (req as any).io = io;
    next();
  };
};
