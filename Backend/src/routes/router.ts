// import { Router } from "express";
// import adminRoutes from "./admin/adminRoute";
// import userRoutes from "./userRoutes/userRoute";
// import expertRoutes from "./mentor/mentorRoute"; // mentor routes
// import seekerRoutes from "./mentee/menteeRoute"; // mentee routes
// import webhookRoute from "./webhook/webhhookRoute";
// const router = Router();
// console.log("step 0");

// router.use("/admin", adminRoutes);
// router.use("/user", userRoutes);
// router.use("/seeker", seekerRoutes);
// router.use("/expert", expertRoutes);
// router.use("/stripe/api", webhookRoute);
// export { router };
import { Router } from "express";
import adminRoutes from "./admin/adminRoute";
import userRoutes from "./userRoutes/userRoute";
import expertRoutes from "./mentor/mentorRoute";
import seekerRoutes from "./mentee/menteeRoute";
import webhookRoute from "./webhook/webhhookRoute";
import mediaRoutes from "./media/mediaRoute"; // Add this import

const router = Router();

console.log("step 0");

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);
router.use("/seeker", seekerRoutes);
router.use("/expert", expertRoutes);
router.use("/stripe/api", webhookRoute);
router.use("/media", mediaRoutes); // Add this line

export { router };
