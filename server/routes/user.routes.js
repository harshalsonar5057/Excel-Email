import express from 'express';
const router = express.Router();

import validateRequest from "../middleware/validateRequest.middleware";
import { createUser,login } from "../controllers/user.controller";

router.post("/create",  validateRequest, createUser);
router.post("/login",login);
// router.post("/logout", [authMiddleware.user], logout)
// router.patch("/:Id", [authMiddleware.user], updateUser);


export default router;