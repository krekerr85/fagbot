import mongoose from "mongoose";
const { Schema } = mongoose;

const infoSchema = new Schema({
  currentPidor: Number,
  currentCool: Number,
  currentGnida: Number,
  date_created: { type: Date, default: Date.now },

});

export const InfoModel = mongoose.model("Info", infoSchema);