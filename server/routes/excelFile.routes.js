import express from 'express';
const router = express.Router();
import validateRequest from "../middleware/validateRequest.middleware";
import { uploadFile,readFile,sendEmail, getPendingFile } from "../controllers/excelFile.controller";
import authMiddleware from "../middleware/auth.middleware";
router.post("/upload",[authMiddleware.user],validateRequest, uploadFile);
router.post("/read",[authMiddleware.user],validateRequest, readFile);
router.post("/send-email",[authMiddleware.user],validateRequest, sendEmail);
router.get("/get-pendings-file", [authMiddleware.user], validateRequest, getPendingFile);


export default router;
