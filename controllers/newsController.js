import News from "../models/News.js";
import fs from "fs";

export const createNews = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const image = req.file ? req.file.path : null;

    const news = new News({ title, description, date, image });
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSingleNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: "News not found" });

    let liked = false;
    let disliked = false;

    if (req.user) {
      const userId = req.user.id;
      liked = news.likes.includes(userId);
      disliked = news.dislikes.includes(userId);
    }

    res.json({
      ...news.toObject(),
      likesCount: news.likes.length,
      dislikesCount: news.dislikes.length,
      liked,
      disliked,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.path : undefined;

    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: "Not found" });

    if (image && news.image) fs.unlinkSync(news.image);

    news.title = title ?? news.title;
    news.description = description ?? news.description;
    if (image) news.image = image;

    await news.save();
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ error: "Not found" });

    if (news.image) fs.unlinkSync(news.image);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { username, comment } = req.body;
    const news = await News.findById(req.params.id);

    if (!news) return res.status(404).json({ error: "News not found" });

    const newComment = { username, comment };
    news.comments.push(newComment);
    await news.save();

    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likeNews = async (req, res) => {
  try {
    const userId = req.user.id; // جاي من الـ middleware الخاص بالتحقق من التوكن
    const news = await News.findById(req.params.id);

    if (!news) return res.status(404).json({ error: "news not found" });

    // لو كان عامل ديسلايك، نشيله
    news.dislikes = news.dislikes.filter((id) => id.toString() !== userId);

    if (news.likes.includes(userId)) {
      // لو كان عامل لايك قبل كده، نشيله (إلغاء لايك)
      news.likes = news.likes.filter((id) => id.toString() !== userId);
    } else {
      // لو ما عاملش لايك، نضيفه
      news.likes.push(userId);
    }

    await news.save();

    res.json({
      likesCount: news.likes.length,
      dislikesCount: news.dislikes.length,
      liked: news.likes.includes(userId),
      disliked: false,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const dislikeNews = async (req, res) => {
  try {
    const userId = req.user.id;
    const news = await News.findById(req.params.id);

    if (!news) return res.status(404).json({ error: "news not found" });

    // لو كان عامل لايك، نشيله
    news.likes = news.likes.filter((id) => id.toString() !== userId);

    if (news.dislikes.includes(userId)) {
      // لو عامل ديسلايك قبل كده، نشيله (إلغاء)
      news.dislikes = news.dislikes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // نضيفه في ديسلايك
      news.dislikes.push(userId);
    }

    await news.save();

    res.json({
      likesCount: news.likes.length,
      dislikesCount: news.dislikes.length,
      liked: false,
      disliked: news.dislikes.includes(userId),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};