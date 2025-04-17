// controllers/contactController.js
import Contact from "../models/Contact.js";

export const sendMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    const contact = new Contact({ firstName, lastName, email, phone, message });
    await contact.save();

    res.status(201).json({ message: "تم إرسال رسالتك بنجاح!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
