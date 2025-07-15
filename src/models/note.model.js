import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required."] },
    content: { type: String, required: [true, "Content is required."] },
  },
  {
    timestamps: true,
  }
);

const notes = mongoose.model("note", NoteSchema);

export default notes;
