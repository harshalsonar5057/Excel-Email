import express from "express";
const router = express.Router();
import validateRequest from "../middleware/validateRequest.middleware";
import { count, getLeads, updateStatus } from "../controllers/lead.controller";
import authMiddleware from "../middleware/auth.middleware";

router.get("/count", [authMiddleware.user], validateRequest, count);
router.get("/getAll", [authMiddleware.user], validateRequest, getLeads);
router.patch("/:id", [authMiddleware.user], validateRequest, updateStatus)

export default router;
