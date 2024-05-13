import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customError.js";
import Admin from "../models/adminModel.js";
import Dates from "../models/dateModel.js";
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
  if (req.user.role !== "admin") {
    throw new UnauthorizedError("you aren't authorized");
  }
  const hashedPassword = await hashPassword(req.body.password);

  const updated = await Admin.findByIdAndUpdate(req.user.userId, {
    password: hashedPassword,
  });

  res.status(StatusCodes.OK).json({ msg: "password successfully updated" });
};

export const setPreliminaryVotingDates = async (req, res) => {
  if (req.user.role !== "admin") {
    throw new UnauthorizedError("you aren't authorized");
  }
  const { start, end } = req.body;
  let date = await Dates.findOne({ name: "preliminaryVoteDate" });
  if (!date) {
    date = await Dates.create({ name: "preliminaryVoteDate", start, end });
  } else {
    date.start = start;
    date.end = end;
    await date.save();
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "successfully added preliminary voting date" });
};
export const setVoterRegistrationDates = async (req, res) => {
  if (req.user.role !== "admin") {
    throw new UnauthorizedError("you aren't authorized");
  }

  const { start, end } = req.body;
  let date = await Dates.findOne({ name: "voterRegistrationDate" });
  if (!date) {
    date = await Dates.create({ name: "voterRegistrationDate", start, end });
  } else {
    date.start = start;
    date.end = end;
    await date.save();
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "successfully added voter registration date" });
};
export const setMainVotingDates = async (req, res) => {
  if (req.user.role !== "admin") {
    throw new UnauthorizedError("you aren't authorized");
  }

  const { start, end } = req.body;
  let date = await Dates.findOne({ name: "mainVotingDate" });
  if (!date) {
    date = await Dates.create({ name: "mainVotingDate", start, end });
  } else {
    date.start = start;
    date.end = end;
    await date.save();
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "successfully added main voting date" });
};
