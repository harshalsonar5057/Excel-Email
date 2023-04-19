import express from 'express';
const router = express.Router();
import validateRequest from "../middleware/validateRequest.middleware";
import { count } from "../controllers/lead.controller";
import authMiddleware from "../middleware/auth.middleware";
router.get("/count",[authMiddleware.user],validateRequest, count);



export default router;
