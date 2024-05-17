import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customError.js";
import Student from "../models/studentModel.js";
import { comparePassword } from "../utils/passwordUtils.js";
import { createToken } from "../utils/tokenUtils.js";
import candidiateModel from "../models/candidiateModel.js";
import Dates from "../models/dateModel.js";

const currentDate = new Date().toISOString().split("T")[0];

export const login = async (req, res) => {
  const { studentId, password } = req.body;
  const student = await Student.findOne({ studentId });

  if (student) {
    if (student.role !== "candidate") {
      throw new UnauthorizedError("you are not authorized");
    }
  }
  const isValidStudent =
    student && (await comparePassword(password, student.password));

  if (!isValidStudent) {
    throw new UnauthenticatedError("invalid credentials");
  }

  const token = createToken({ userId: student._id, role: student.role });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });
  res.status(StatusCodes.CREATED).json({ msg: "successfully logged in" });
};

export const addInfo = async (req, res) => {
  if (req.user.role !== "candidate") {
    throw new UnauthorizedError("you aren't authorized");
  }

  const { email, phone, Age, Department, Campaign } = req.body;

  const candidate = await candidiateModel.findOne({
    candidateId: req.user.userId,
  });

  candidate.email = email;
  candidate.phone = phone;
  candidate.Age = Age;
  candidate.Department = Department;
  candidate.Campaign = Campaign;
  await candidate.save();
  res.status(StatusCodes.OK).json({ msg: "information successfully added" });
};

export const getCandidateInfo = async (req, res) => {
  const { id } = req.params;
  const preliminaryVoteDate = await Dates.findOne({
    name: "preliminaryVoteDate",
  });

  if (
    !preliminaryVoteDate ||
    currentDate <= preliminaryVoteDate.end.toISOString().split("T")[0]
  ) {
    throw new BadRequestError("the information is not added yet");
  }

  const candidateInfo = await candidiateModel.findOne({ candidateId: id });
  if (!candidateInfo) {
    throw new NotFoundError("the information is not added yet");
  }

  res.status(StatusCodes.OK).json({ candidateInfo: candidateInfo });
};
