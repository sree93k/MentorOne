import { Router } from "express";
import webhookController from "../../controllers/implementation/webHookController";
import { stripeMiddleware } from "../../middlewares/stripeMiddleware";

const webhookRoute = Router();

webhookRoute.post(
  "/webhook",
  stripeMiddleware,
  webhookController.handleWebhook
);

export default webhookRoute;
