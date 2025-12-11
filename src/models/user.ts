import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  nickname: { type: String, required: true },
  password: { type: String, required: true },
  profile: {
    type: String,
    default: `${process.env.IMAGE_SOURCE}/v1765397440/cream/profile/user_f1vmy9.png`,
  },
});

export default mongoose.model("User", userSchema);
