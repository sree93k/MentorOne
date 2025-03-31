import { Router } from "express";
import adminRoutes from "./admin/adminRoute";
import userRoutes from "./userRoutes/userAuthRoute";
// import expertRoutes from "./mentor/mentorRoute";  // mentor routes
// import seekerRoutes from "./mentee/menteeRoute";  // mentee routes

const router = Router();
console.log("step 0");

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);
// router.use("/seeker", seekerRoutes);
// router.use("/expert", expertRoutes);
export { router };
