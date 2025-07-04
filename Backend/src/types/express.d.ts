// import { Request } from "express";

// declare module "express-serve-static-core" {
//   interface Request {
//     user?: {
//       rawToken: string;
//       id: string;
//     };
//   }
// }

import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload & { rawToken?: string };
  }
}
