import express from "express";
const router = express.Router();
import validateRequest from "../middleware/validateRequest.middleware";
import { createVender, getvender } from "../controllers/vender.controller";
import { venderCreateValidation } from "../validators/user.validator";
import authMiddleware from "../middleware/auth.middleware";

router.post("/create", [venderCreateValidation, validateRequest], createVender);
router.get("/getAll", [authMiddleware.user], validateRequest, getvender);

export default router;
