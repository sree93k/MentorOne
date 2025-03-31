import { Router } from "express";
import userAuthRoute from './userAuthRoute'
// import userPrivateRoute from './userPrivateRoute'
// import {authenticateUser} from '../../middlewares/authenticateuser'

const userRoutes = Router();


userRoutes.use('/auth',userAuthRoute)
// userRoutes.use('/',authenticateUser,userPrivateRoute)

export default userRoutes;