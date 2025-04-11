import { NextFunction, Request, Response } from "express";
import ApiResponse from "../../utils/apiResponse";

class UserController {
  constructor() {}

  public validateSuccessResponse = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.status(200).json(new ApiResponse(200, null, "Success"));
      return;
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
