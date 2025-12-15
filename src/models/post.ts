import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: { url: String, public_id: String } },
});

postSchema.virtual("id").get(function () {
  return this._id.toString();
});

export default mongoose.model("Post", postSchema);
