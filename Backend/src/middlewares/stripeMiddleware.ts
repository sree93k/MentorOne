// import { Request, Response, NextFunction } from "express";
// import bodyParser from "body-parser";

// declare module "express-serve-static-core" {
//   interface Request {
//     rawBody?: string;
//     sig?: string;
//   }
// }

// // Middleware to capture the raw body for Stripe webhook verification
// export const stripeMiddleware = [
//   bodyParser.raw({ type: "application/json" }), // Captures raw body as Buffer
//   (req: Request, res: Response, next: NextFunction) => {
//     req.sig = req.headers["stripe-signature"] as string; // Extract Stripe signature header
//     req.rawBody = req.body; // Assign raw body to `req.rawBody`
//     next();
//   },
// ];

import { Request, Response, NextFunction } from "express";
import { buffer } from "micro";

export const stripeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "POST") {
    let rawBody = await buffer(req);
    req.body = rawBody;
    req.headers["stripe-signature"] = req.get("stripe-signature") || "";
  }
  next();
};
