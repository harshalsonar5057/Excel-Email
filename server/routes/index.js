import express from "express";
const router = express.Router();
import { moduleRoutes } from "./app.routes";

// Routes files
import UserRoutes from "./user.routes";
import ExcelRoutes from "./excelFile.routes";

router.use(moduleRoutes.user, UserRoutes);
router.use(moduleRoutes.excel, ExcelRoutes);
export default router;
