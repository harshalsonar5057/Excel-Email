import express from "express";
const router = express.Router();
import { moduleRoutes } from "./app.routes";

// Routes files
import UserRoutes from "./user.routes";
import ExcelRoutes from "./excelFile.routes";
import VenderRoutes from "./vender.routes";
import LeadRoutes from "./leads.routes";
import emailRoutes from "./emails.routes";

router.use(moduleRoutes.user, UserRoutes);
router.use(moduleRoutes.excel, ExcelRoutes);
router.use(moduleRoutes.vender, VenderRoutes);
router.use(moduleRoutes.lead, LeadRoutes);
router.use(moduleRoutes.email, emailRoutes);
export default router;
