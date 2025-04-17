import Events from "../models/Events.js";
import fs from "fs";

export const createEvents = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const image = req.file ? req.file.path : null;

    const events = new Events({ title, description, date, image });
    await events.save();
    res.status(201).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Events.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSingleEvent = async (req, res) => {
  try {
    const event = await Events.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    let liked = false;
    let disliked = false;

    if (req.user) {
      const userId = req.user.id;
      liked = event.likes.includes(userId);
      disliked = event.dislikes.includes(userId);
    }

    res.json({
      ...event.toObject(),
      likesCount: event.likes.length,
      dislikesCount: event.dislikes.length,
      liked,
      disliked,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateEvents = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.path : undefined;

    const events = await Events.findById(req.params.id);
    if (!events) return res.status(404).json({ error: "Not found" });

    if (image && events.image) fs.unlinkSync(events.image);

    events.title = title ?? events.title;
    events.description = description ?? events.description;
    if (image) events.image = image;

    await events.save();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEvents = async (req, res) => {
  try {
    const events = await Events.findByIdAndDelete(req.params.id);
    if (!events) return res.status(404).json({ error: "Not found" });

    if (events.image) fs.unlinkSync(events.image);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const addComment = async (req, res) => {
  try {
    const { username, comment } = req.body;
    const event = await Events.findById(req.params.id);

    if (!event) return res.status(404).json({ error: "Event not found" });

    const newComment = { username, comment };
    event.comments.push(newComment);
    await event.save();

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likeEvents = async (req, res) => {
  try {
    const userId = req.user.id; // جاي من الـ middleware الخاص بالتحقق من التوكن
    const events = await Events.findById(req.params.id);

    if (!events) return res.status(404).json({ error: "Events not found" });

    // لو كان عامل ديسلايك، نشيله
    events.dislikes = events.dislikes.filter((id) => id.toString() !== userId);

    if (events.likes.includes(userId)) {
      // لو كان عامل لايك قبل كده، نشيله (إلغاء لايك)
      events.likes = events.likes.filter((id) => id.toString() !== userId);
    } else {
      // لو ما عاملش لايك، نضيفه
      events.likes.push(userId);
    }

    await events.save();

    res.json({
      likesCount: events.likes.length,
      dislikesCount: events.dislikes.length,
      liked: events.likes.includes(userId),
      disliked: false,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const dislikeEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await Events.findById(req.params.id);

    if (!events) return res.status(404).json({ error: "Events not found" });

    // لو كان عامل لايك، نشيله
    events.likes = events.likes.filter((id) => id.toString() !== userId);

    if (events.dislikes.includes(userId)) {
      // لو عامل ديسلايك قبل كده، نشيله (إلغاء)
      events.dislikes = events.dislikes.filter((id) => id.toString() !== userId);
    } else {
      // نضيفه في ديسلايك
      events.dislikes.push(userId);
    }

    await events.save();

    res.json({
      likesCount: events.likes.length,
      dislikesCount: events.dislikes.length,
      liked: false,
      disliked: events.dislikes.includes(userId),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



