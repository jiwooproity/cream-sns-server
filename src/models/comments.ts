import mongoose, { Types } from "mongoose";

const commentsSchema = new mongoose.Schema(
  {
    author: { type: Types.ObjectId, ref: "User", require: true },
    postId: { type: Types.ObjectId, require: true },
    content: { type: String, require: true },
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

export default mongoose.model("Comments", commentsSchema);
