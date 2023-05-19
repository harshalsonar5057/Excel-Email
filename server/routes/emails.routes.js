import express from 'express';
const router = express.Router();
import validateRequest from "../middleware/validateRequest.middleware";
import { emailSent, createTemplate, sendTemplate} from "../controllers/emails.controller";
import authMiddleware from "../middleware/auth.middleware";

router.post("/emailSent/:id",[authMiddleware.user],validateRequest, emailSent);
router.post("/create",[authMiddleware.user],validateRequest, createTemplate);
router.post("/send-template/:templateName",[authMiddleware.user],validateRequest, sendTemplate);

export default router;
