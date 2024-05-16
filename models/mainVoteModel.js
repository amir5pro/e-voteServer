import mongoose from "mongoose";

const MainVoteSchema = new mongoose.Schema({
  voter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

export default mongoose.model("MainVote", MainVoteSchema);
