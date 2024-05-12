import {
  BadRequestError,
  UnauthenticatedError,
} from "../errors/customError.js";
import Admin from "../models/adminModel.js";
import { StatusCodes } from "http-status-codes";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { createToken } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
  const { email } = req.body;
  let admin = await Admin.findOne({ email });

  if (admin) {
    throw new BadRequestError("email already exists");
  }

  const hashedPassword = await hashPassword(req.body.password);

  req.body.password = hashedPassword;

  admin = await Admin.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "successfully registered" });
};

export const login = async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email });
  const isValidAdmin =
    admin && (await comparePassword(req.body.password, admin.password));

  if (!isValidAdmin) {
    throw new UnauthenticatedError("invalid credentials");
  }
  const token = createToken({ userId: admin._id, role: admin.role });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });
  res.status(StatusCodes.CREATED).json({ msg: "successfully logged in" });
};

export const updateInfo = async (req, res) => {
  console.log(req.user);
  res.send("ffffffffff");
};
