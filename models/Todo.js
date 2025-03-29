import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
  }
);

export default mongoose.models.Todo || mongoose.model("Todo", TodoSchema);
