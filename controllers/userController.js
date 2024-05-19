import { StatusCodes } from "http-status-codes";
import Admin from "../models/adminModel.js";
import Student from "../models/studentModel.js";

export const getCurrentUser = async (req, res) => {
  let user;

  user = await Admin.findOne({ _id: req.user.userId }, { password: 0 });

  if (!user) {
    user = await Student.findOne({ _id: req.user.userId }, { password: 0 });
  }

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found" });
  }
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};
