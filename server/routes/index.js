import express from "express";
const router = express.Router();
import { moduleRoutes } from "./app.routes";

// Routes files
import UserRoutes from "./user.routes";

router.use(moduleRoutes.user, UserRoutes);
export default router;
