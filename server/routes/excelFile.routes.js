import express from 'express';
const router = express.Router();
import validateRequest from "../middleware/validateRequest.middleware";
import { uploadFile,readFile } from "../controllers/excelFile.controller";
import authMiddleware from "../middleware/auth.middleware";
router.post("/upload",[authMiddleware.user],validateRequest, uploadFile);
router.post("/read",[authMiddleware.user],validateRequest, readFile);


export default router;
