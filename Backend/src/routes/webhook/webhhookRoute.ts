import { Router } from "express";
import webhookController from "../../controllers/webHookController/webHookController";
import { stripeMiddleware } from "../../middlewares/stripeMiddleware";

const webhookRoute = Router();

webhookRoute.post("/", stripeMiddleware, webhookController.handleWebhook);

export default webhookRoute;
