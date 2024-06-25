import Student from "../models/studentModel.js";
import Dates from "../models/dateModel.js";
import preliminaryVoteModel from "../models/preliminaryVoteModel.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customError.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { StatusCodes } from "http-status-codes";
import { createToken } from "../utils/tokenUtils.js";
import candidiateModel from "../models/candidiateModel.js";
import mainVoteModel from "../models/mainVoteModel.js";

const currentDate = new Date().toISOString().split("T")[0];

export const register = async (req, res) => {
  const { studentId, password } = req.body;

  const voterRegistrationDate = await Dates.findOne({
    name: "voterRegistrationDate",
  });

  if (
    !voterRegistrationDate ||
    currentDate < voterRegistrationDate.start.toISOString().split("T")[0] ||
    currentDate > voterRegistrationDate.end.toISOString().split("T")[0]
  ) {
    throw new BadRequestError("Voter registration is not allowed at this time");
  }

  const student = await Student.findOne({ studentId });
  if (!student) {
    throw new UnauthorizedError("you are not allowed to register !");
  }
  if (student.registered === true) {
    throw new BadRequestError("you are already registered");
  }
  const hashedPassword = await hashPassword(password);

  student.password = hashedPassword;
  student.registered = true;

  await student.save();
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "you are successfully registered,please login to vote" });
};

export const login = async (req, res) => {
  const { studentId, password } = req.body;
  const student = await Student.findOne({ studentId });

  if (student) {
    if (student.registered === false) {
      throw new UnauthenticatedError("please register to login");
    }
  }

  const isValidStudent =
    student && (await comparePassword(password, student.password));

  if (!isValidStudent) {
    throw new UnauthenticatedError("invalid credentials");
  }

  const token = createToken({ userId: student._id, role: student.role });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "successfully logged in", dataToken: token });
};

export const getAllStudents = async (req, res) => {
  const { name } = req.query;

  let students;
  if (name) {
    students = await Student.find({ name: { $regex: new RegExp(name, "i") } });
  } else {
    students = await Student.find({});
  }

  if (students.length === 0) {
    throw new NotFoundError("No students found");
  }

  res.status(StatusCodes.OK).json({ students: students });
};
export const preliminaryVote = async (req, res) => {
  const voterId = req.user.userId;

  const { id } = req.params;

  if (req.user.role !== "voter") {
    throw new UnauthorizedError("you aren't authorized");
  }

  const preliminaryVoteDate = await Dates.findOne({
    name: "preliminaryVoteDate",
  });

  if (
    !preliminaryVoteDate ||
    currentDate < preliminaryVoteDate.start.toISOString().split("T")[0] ||
    currentDate > preliminaryVoteDate.end.toISOString().split("T")[0]
  ) {
    throw new BadRequestError("preliminary vote  is not allowed at this time");
  }

  const hasVoted = await preliminaryVoteModel.findOne({ voter: voterId });
  if (hasVoted) {
    throw new UnauthorizedError("You have already voted");
  }

  const student = await Student.findById(id);

  if (!student || student.registered === false) {
    throw new NotFoundError("selected student is not  registered");
  }

  await preliminaryVoteModel.create({
    voter: voterId,
    candidate: id,
  });

  res.status(StatusCodes.CREATED).json({ msg: "successfully voted" });
};

export const getCandidates = async (req, res) => {
  const preliminaryVoteDate = await Dates.findOne({
    name: "preliminaryVoteDate",
  });

  if (
    !preliminaryVoteDate ||
    currentDate <= preliminaryVoteDate.end.toISOString().split("T")[0]
  ) {
    throw new BadRequestError("the preliminary voting isn't finished");
  }

  const existingCandidates = await candidiateModel.find({});
  if (existingCandidates.length === 0) {
    const topCandidates = await preliminaryVoteModel.aggregate([
      { $group: { _id: "$candidate", totalVotes: { $sum: 1 } } },
      { $sort: { totalVotes: -1 } },
      { $limit: 8 },
    ]);

    for (const candidate of topCandidates) {
      const student = await Student.findById(candidate._id);

      if (student) {
        // Update student role to "candidate"
        student.role = "candidate";
        await student.save();

        // Create candidate document in candidates collection
        await candidiateModel.create({
          name: student.name,
          candidateId: student._id,
        });
      }
    }

    const candidateData = await candidiateModel.find({});

    res.status(StatusCodes.CREATED).json({ data: candidateData });
  } else {
    res.status(StatusCodes.OK).json({ data: existingCandidates });
  }
};

export const mainVote = async (req, res) => {
  const voterId = req.user.userId;
  const { id } = req.params;
  if (req.user.role !== "voter") {
    throw new UnauthorizedError("you aren't authorized");
  }

  const mainVotingDate = await Dates.findOne({
    name: "mainVotingDate",
  });

  if (
    !mainVotingDate ||
    currentDate < mainVotingDate.start.toISOString().split("T")[0] ||
    currentDate > mainVotingDate.end.toISOString().split("T")[0]
  ) {
    throw new BadRequestError("voting  is not allowed at this time");
  }

  const hasVoted = await mainVoteModel.findOne({ voter: voterId });
  if (hasVoted) {
    throw new UnauthorizedError("You have already voted");
  }

  const student = await Student.findById(id);

  if (!student || student.role === "voter") {
    throw new NotFoundError("selected candidate not found");
  }

  await mainVoteModel.create({
    voter: voterId,
    candidate: id,
  });

  res.status(StatusCodes.CREATED).json({ msg: "successfully voted" });
};

export const getResult = async (req, res) => {
  const mainVotingDate = await Dates.findOne({
    name: "mainVotingDate",
  });

  if (
    !mainVotingDate ||
    currentDate < mainVotingDate.start.toISOString().split("T")[0]
  ) {
    throw new BadRequestError("the main voting isn't started");
  }

  const candidatesWithVotes = await candidiateModel.aggregate([
    {
      $lookup: {
        from: "mainvotes",
        localField: "candidateId",
        foreignField: "candidate",
        as: "votes",
      },
    },
    {
      $project: {
        _id: 0,
        candidateId: 1,
        name: 1,
        Votes: { $size: "$votes" },
      },
    },
  ]);

  if (candidatesWithVotes.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "No candidates with votes found." });
  }
  for (const candidate of candidatesWithVotes) {
    const student = await Student.findOne({ _id: candidate.candidateId });
    if (student) {
      candidate.studentDetails = student.studentId;
    } else {
      candidate.studentDetails = null;
    }
  }
  const totalVotesCount = await mainVoteModel.countDocuments();
  res
    .status(StatusCodes.OK)
    .json({ data: candidatesWithVotes, totalVotes: totalVotesCount });
};

export const getStats = async (req, res) => {
  const mainVotingDate = await Dates.findOne({
    name: "mainVotingDate",
  });

  if (
    !mainVotingDate ||
    currentDate < mainVotingDate.end.toISOString().split("T")[0]
  ) {
    throw new BadRequestError("the  voting proccess isn't finished");
  }

  const totalEligibleVoters = await Student.countDocuments({ role: "voter" });
  const totalVoters = await mainVoteModel.countDocuments();

  const voterBasedOnGender = await Student.aggregate([
    {
      $match: {
        gender: { $in: ["male", "female"] }, // Filter students with gender either "male" or "female"
      },
    },
    {
      $lookup: {
        from: "mainvotes",
        localField: "_id",
        foreignField: "voter",
        as: "voter_info",
      },
    },
    {
      $match: {
        voter_info: { $ne: [] }, // Filter out students who are not found in the MainVotes collection
      },
    },
    {
      $group: {
        _id: "$gender",
        count: { $sum: 1 },
      },
    },
  ]);
  res.status(StatusCodes.OK).json({
    totalEligibleVoters: totalEligibleVoters,
    totalVoters: totalVoters,
    voterBasedOnGender: voterBasedOnGender,
  });
};
