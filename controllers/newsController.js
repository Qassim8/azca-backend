import News from "../models/News.js";
import fs from "fs";

export const createNews = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.path : null;

    const news = new News({ title, description, image });
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
    if (!news) return res.status(404).json({ error: "Not found" });
    res.json(news);
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
