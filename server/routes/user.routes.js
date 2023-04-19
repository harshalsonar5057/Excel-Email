import express from 'express';
const router = express.Router();
import authMiddleware from "../middleware/auth.middleware";
import validateRequest from "../middleware/validateRequest.middleware";
import { createUser,login } from "../controllers/user.controller";
import { userCreateValidation, loginValidation,  } from "../validators/user.validator";
router.post("/create", [userCreateValidation, validateRequest], createUser);
router.post("/login",loginValidation, validateRequest,login);
// router.post("/logout", [authMiddleware.user], logout)
// router.patch("/:Id", [authMiddleware.user], updateUser);


export default router;