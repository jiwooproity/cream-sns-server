import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    image: { type: { url: String, public_id: String } },
    createdAt: { type: Number, required: true },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    versionKey: false,
  }
);

export default mongoose.model("Post", postSchema);
