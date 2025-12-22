import mongoose, { Types } from "mongoose";

const likesSchema = new mongoose.Schema({
  userId: { type: Types.ObjectId, required: true },
  postId: { type: Types.ObjectId, required: true },
});

likesSchema.index({ userId: 1, postId: 1 }, { unique: true });

export default mongoose.model("Likes", likesSchema);
