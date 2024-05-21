import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema({
  name: String,
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  email: String,
  phone: String,
  Age: String,
  Department: String,
  Campaign: String,
  avatar: String,
  avatarPublicId: String,
});

export default mongoose.model("Candidate", CandidateSchema);
