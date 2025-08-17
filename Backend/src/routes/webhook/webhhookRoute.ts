import { Router } from "express";
import { RouteFactory } from "../../utils/routeFactory";
import { stripeMiddleware } from "../../middlewares/stripeMiddleware";

const webhookRoute = Router();

// Get controller instance from factory
const webhookController = RouteFactory.getWebHookController();

webhookRoute.post(
  "/webhook",
  stripeMiddleware,
  webhookController.handleWebhook
);

export default webhookRoute;
