import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

interface IGroup extends Document {
  group_id: number;
  group_name: string;  
  date_created: Date;
}

const groupSchema = new Schema({
  group_id: {
    type: Number,
    unique: true,
    required: true,
  },
  group_name: String,

  date_created: { type: Date, default: Date.now },
});

export const GroupModel = mongoose.model<IGroup>("Group", groupSchema);
