import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String
}, { timestamps: true });

export default mongoose.model("News", newsSchema);
