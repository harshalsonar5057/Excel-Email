import express from 'express';
const router = express.Router();
import validateRequest from "../middleware/validateRequest.middleware";
import { createVender } from "../controllers/vender.controller";
import { venderCreateValidation  } from "../validators/user.validator";
router.post("/create", [venderCreateValidation, validateRequest], createVender);



export default router;