import express from "express";
import multer from "multer";
import {
  createNews,
  getAllNews,
  getSingleNews,
  updateNews,
  deleteNews,
  addComment,
  likeNews,
  dislikeNews
} from "../controllers/newsController.js";
import path from "path";
import { optionalToken, verifyToken } from "../middleware/verifyToken.js";

export const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

router.post("/", upload.single("image"), createNews);
router.get("/", getAllNews);
router.get("/:id", optionalToken, getSingleNews);
router.put("/:id", upload.single("image"), updateNews);
router.delete("/:id", deleteNews);
router.post("/:id/comments", addComment);
router.post("/:id/like", verifyToken, likeNews);
router.post("/:id/dislike", verifyToken, dislikeNews);

export default router;
