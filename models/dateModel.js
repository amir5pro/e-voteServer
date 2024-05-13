import mongoose from "mongoose";
const DateSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["voterRegistrationDate", "preliminaryVoteDate", "mainVotingDate"],
    default: "voterRegistrationDate",
  },
  start: Date,
  end: Date,
});

export default mongoose.model("Date", DateSchema);
