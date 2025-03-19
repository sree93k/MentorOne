import { Router } from "express";
import adminRoutes from "./admin/adminAuthRoute";
// import seekerRoutes from "./mentor/mentorRoute";  // mentor routes
// import expertRoutes from "./mentee/menteeRoute";  // mentee routes

const router = Router();

router.use("/api/admin", adminRoutes);
// router.use("/api/seeker", seekerRoutes);
// router.use("/api/expert", expertRoutes);

export { router };
