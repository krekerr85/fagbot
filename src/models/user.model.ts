import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

interface IUser extends Document {
  username: string;
  user_id: number;
  first_name: string;
  last_name: string;
  role: string;
  date_created: Date;
  group_id: Types.ObjectId; // Reference to Group model
}

const userSchema = new Schema({
  username: String,
  user_id: {
    type: Number,
    unique: true,
    required: true,
  },
  first_name: String,
  last_name: String,
  role: {
    type: String,
    default: "user",
  },
  group_id: {
    type: Schema.Types.ObjectId,
    unique: true,
    ref: "Group",
  },
  date_created: { type: Date, default: Date.now },
});

userSchema.index({ user_id: 1, group_id: 1 }, { unique: true });
export const UserModel = mongoose.model<IUser>("User", userSchema);
