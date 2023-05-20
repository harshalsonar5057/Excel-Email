import express from "express";
const router = express.Router();
import validateRequest from "../middleware/validateRequest.middleware";
import { createVender, getvender, getSingleUser, deleteVender, updaVender } from "../controllers/vender.controller";
import { venderCreateValidation } from "../validators/user.validator";
import authMiddleware from "../middleware/auth.middleware";

router.post("/create", [venderCreateValidation, validateRequest], createVender);
router.get("/getAll", [authMiddleware.user], validateRequest, getvender);
router.get("/:id", [authMiddleware.user], validateRequest, getSingleUser);
router.delete("/:id", [authMiddleware.user], validateRequest, deleteVender);
router.put("/:id", [authMiddleware.user], updaVender);

export default router;
