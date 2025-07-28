import { Router } from "express";
import chatbotController from "../../controllers/implementation/chatbotController";
import { optionalAuthenticate } from "../../middlewares/optionalAuthenticate";

const chatbotRouter = Router();

// Public routes (no authentication required, but can benefit from it)
chatbotRouter.post(
  "/message",
  optionalAuthenticate, // This middleware sets req.user if token exists, but doesn't reject if missing
  chatbotController.sendMessage.bind(chatbotController)
);

chatbotRouter.get(
  "/categories",
  optionalAuthenticate,
  chatbotController.getCategories.bind(chatbotController)
);

chatbotRouter.get(
  "/faqs",
  optionalAuthenticate,
  chatbotController.getAllFAQs.bind(chatbotController)
);

chatbotRouter.get(
  "/faqs/category/:categoryId",
  optionalAuthenticate,
  chatbotController.getFAQsByCategory.bind(chatbotController)
);

chatbotRouter.get(
  "/rate-limit-status",
  optionalAuthenticate,
  chatbotController.getRateLimitStatus.bind(chatbotController)
);

// Routes that can work without authentication but store data if available
chatbotRouter.post(
  "/faq/:faqId/helpful",
  optionalAuthenticate,
  chatbotController.markFAQHelpful.bind(chatbotController)
);

chatbotRouter.get(
  "/conversation/:sessionId",
  optionalAuthenticate,
  chatbotController.getConversationHistory.bind(chatbotController)
);

chatbotRouter.delete(
  "/conversation/:sessionId",
  optionalAuthenticate,
  chatbotController.clearConversation.bind(chatbotController)
);
chatbotRouter.get("/test-ai", chatbotController.testAI.bind(chatbotController));
chatbotRouter.get(
  "/debug-faqs",
  chatbotController.debugFAQs.bind(chatbotController)
);
export default chatbotRouter;
