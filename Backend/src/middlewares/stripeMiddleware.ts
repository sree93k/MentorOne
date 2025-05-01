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

// import { Request, Response, NextFunction } from "express";
// import { buffer } from "micro";

// export const stripeMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (req.method === "POST") {
//     let rawBody = await buffer(req);
//     req.body = rawBody;
//     req.headers["stripe-signature"] = req.get("stripe-signature") || "";
//   }
//   next();
// };

// import { Request, Response, NextFunction } from "express";
// import stripe from "../config/stripe";

// export const stripeMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (req.originalUrl === "/webhook") {
//     // Ensure raw body is preserved for Stripe webhook
//     req.rawBody = req.body;
//     next();
//   } else {
//     next();
//   }
// };

import { Request, Response, NextFunction } from "express";
import { buffer } from "micro";

declare module "express-serve-static-core" {
  interface Request {
    rawBody?: Buffer;
  }
}

export const stripeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("stripeMiddleware step 1", req.originalUrl);
  console.log("stripeMiddleware step 2", req.method);
  if (req.originalUrl === "stripe/api/webhook" && req.method === "POST") {
    try {
      const rawBody = await buffer(req);
      req.rawBody = rawBody;
      console.log("Stripe middleware: Raw body buffered");
    } catch (error) {
      console.error("Error buffering raw body:", error);
      res.status(400).send("Invalid request body");
      return;
    }
  }
  next();
};
