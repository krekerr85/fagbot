import mongoose from "mongoose";
const { Schema } = mongoose;

const infoSchema = new Schema({
  currentPidor: Number,
  currentCool: Number,
  group_id: {
    type: Schema.Types.ObjectId,
    unique: true,
    ref: "Group",
  },
  date_created: { type: Date, default: Date.now },

});

export const InfoModel = mongoose.model("Info", infoSchema);