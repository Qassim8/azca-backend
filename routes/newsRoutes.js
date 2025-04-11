import express from "express";
import multer from "multer";
import {
  createNews,
  getAllNews,
  getSingleNews,
  updateNews,
  deleteNews
} from "../controllers/newsController.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

router.post("/", upload.single("image"), createNews);
router.get("/", getAllNews);
router.get("/:id", getSingleNews);
router.put("/:id", upload.single("image"), updateNews);
router.delete("/:id", deleteNews);

export default router;
