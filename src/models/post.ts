import mongoose, { Types } from "mongoose";

const postSchema = new mongoose.Schema({
  userId: { type: Types.ObjectId, required: true },
  content: { type: String, required: true },
  image: { type: { url: String, public_id: String } },
  createdAt: { type: Number, required: true },
});

postSchema.virtual("id").get(function () {
  return this._id.toString();
});

export default mongoose.model("Post", postSchema);
