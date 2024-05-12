import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "admin",
  },
});

export default mongoose.model("Admin", AdminSchema);
