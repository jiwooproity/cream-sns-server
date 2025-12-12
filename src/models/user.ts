import mongoose from "mongoose";

const defaultProfile = `${process.env.IMAGE_SOURCE}/v1765397440/cream/profile/user_f1vmy9.png`;

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  nickname: { type: String, required: true },
  password: { type: String, required: true },
  description: { type: String, default: "" },
  profile: { type: String, default: defaultProfile },
});

export default mongoose.model("User", userSchema);
