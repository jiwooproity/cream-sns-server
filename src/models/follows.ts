import mongoose, { Types } from "mongoose";

const followsSchema = new mongoose.Schema({
  from: { type: Types.ObjectId, require: true },
  to: { type: Types.ObjectId, require: true },
});

followsSchema.index({ from: 1, to: 1 }, { unique: true });

export default mongoose.model("Follows", followsSchema);
