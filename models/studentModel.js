import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: String,
  studentId: String,
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  password: String,
  role: {
    type: String,
    enum: ["voter", "candidate"],
    default: "voter",
  },
  registered: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Student", StudentSchema);
