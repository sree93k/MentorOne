import { Request, Response, NextFunction } from "express";
import ApiResponse from "../utils/apiResponse";
import { verifyAccessToken } from "../utils/jwt";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request & Partial<{ user: string | jwt.JwtPayload }>,
  res: Response,
  next: NextFunction
): void => {
  console.log("autheticte start");

  const token =
    req.headers["authorization"]?.split(" ")[1] || req.header("authorization");

  if (!token) {
    console.log("autheticte failed 1");
    res.status(401).send("Access denied");
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;

    if (decoded.role !== "admin") {
      console.log("autheticte failed2");
      res
        .status(401)
        .json(new ApiResponse(401, null, "you are not authorized"));
      return;
    }
    console.log("autheticte success");
    next();
  } catch (err) {
    res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid Token or Expired"));
    return;
  }
};

// export const authenticateUser=(req:Request & Partial<{user:string | jwt.JwtPayload}>,res:Response,next:NextFunction)=>{
//     const token=req.headers['authorization']?.split(' ')[1] || req.header('authorization')
//     console.log("authenticateUser started 1");

//     if(!token)
//     {
//         return res.status(401).send("Access Denied")
//     }
//     console.log("authenticateUser started 2");
//     try {
//         console.log("authenticateUser started 3");
//         const decoded=verifyAccessToken(token)
//         req.user=decoded
//         next()
//     } catch (error) {
//         res.status(401).json(new ApiResponse(401,null,"Invalid Token or Expired"))
//     }
// }
