import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }],
  },
  { timestamps: true }
);

export const Todo = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);
export default mongoose.models.User || mongoose.model("User", UserSchema);
