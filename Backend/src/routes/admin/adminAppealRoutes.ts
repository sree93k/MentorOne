import { Router } from "express";
import appealController from "../../controllers/implementation/AppealController";
import { authenticate } from "../../middlewares/authenticateAdmin";

const adminAppealRoutes = Router();
adminAppealRoutes.get("/test", (req, res) => {
  res.json({ message: "User routes working" });
});
// Admin routes (require authentication)
adminAppealRoutes.get("/appeals", authenticate, appealController.getAppeals);

adminAppealRoutes.patch(
  "/appeals/:appealId/review",
  authenticate,
  appealController.reviewAppeal
);

adminAppealRoutes.get(
  "/appeals/statistics",
  authenticate,
  appealController.getAppealStatistics
);

export default adminAppealRoutes;
