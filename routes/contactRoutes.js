// routes/contactRoutes.js
import express from "express";
import { getAllMessages, sendMessage } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/", getAllMessages);

export default router;
