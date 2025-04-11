import { Request, Response, NextFunction } from "express";

declare module "../../middlewares/authenticateuser" {
  export function decodedUserRefreshToken(
    req: Request &
      Partial<{ user: string | import("jsonwebtoken").JwtPayload }>,
    res: Response,
    next: NextFunction
  ): void;
}
