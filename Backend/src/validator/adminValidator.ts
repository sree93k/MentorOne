import Joi from 'joi';
import { Request,Response,NextFunction } from 'express';
import { ApiError } from '../middlewares/errorHandler';

const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export function validateAdminLogin(req: Request,res: Response,next: NextFunction){
  const {error} = adminLoginSchema.validate(req.body,{abortEarly:false});
  if(error){
     res.status(400).json(new ApiError(400, 'Validation Error', error.details[0].message));
     return
  }
  next();
}
