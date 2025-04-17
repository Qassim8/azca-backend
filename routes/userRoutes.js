import express from "express";
import {
  registerUser,
  loginUser,
  getAdmins,
  deleteAdmin,
} from "../controllers/userController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// الأدمن فقط يقدر يشوف ويحذف الأدمنات
router.get("/admins", verifyAdmin, getAdmins);
router.delete("/admins/:id", verifyAdmin, deleteAdmin);

export default router;
