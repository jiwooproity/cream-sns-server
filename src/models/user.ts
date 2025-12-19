import mongoose from "mongoose";

const defaultProfile = `${process.env.IMAGE_SOURCE}/v1765397440/cream/profile/user_f1vmy9.png`;

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    nickname: { type: String, required: true },
    password: { type: String, required: true },
    description: { type: String, default: "" },
    profile: {
      type: { url: String, public_id: String },
      default: { url: defaultProfile, public_id: "" },
    },
    postCount: { type: Number, default: 0 },
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.profile._id;
        delete ret.__v;
        return ret;
      },
    },
    versionKey: false,
  }
);

export default mongoose.model("User", userSchema);
