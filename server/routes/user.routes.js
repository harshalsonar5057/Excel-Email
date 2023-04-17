import express from 'express';
const router = express.Router();

import validateRequest from "../middleware/validateRequest.middleware";
import { createUser, logout, verifyOtp, resendOtp, updateUser } from "../controllers/user.controller";
import authMiddleware from "../middleware/auth.middleware";
import { createUservalidation } from "../validators/user.validator";

router.post("/create", createUservalidation(), validateRequest, createUser);
router.post("/logout", [authMiddleware.user], logout)

router.post("/verifyOtp/:Id", verifyOtp);
router.put("/resendOtp", createUservalidation(), validateRequest, resendOtp);

router.patch("/:Id", [authMiddleware.user], updateUser);


export default router;