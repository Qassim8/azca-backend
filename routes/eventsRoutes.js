import express from "express";
import multer from "multer";
import {
  createEvents,
  getAllEvents,
  getSingleEvent,
  updateEvents,
  deleteEvents,
  addComment,
  likeEvents,
  dislikeEvents
} from "../controllers/eventsController.js";
import path from "path";
import { optionalToken, verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/", upload.single("image"), createEvents);
router.get("/", getAllEvents);
router.get("/:id", optionalToken, getSingleEvent);
router.put("/:id", upload.single("image"), updateEvents);
router.delete("/:id", deleteEvents);
router.post("/:id/comments", addComment);
router.post("/:id/like", verifyToken, likeEvents);
router.post("/:id/dislike", verifyToken, dislikeEvents);

export default router;
