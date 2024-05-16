import { Router } from "express";
const router = Router();

import {
  register,
  login,
  updateInfo,
  setMainVotingDates,
  setPreliminaryVotingDates,
  setVoterRegistrationDates,
  addStudent,
  deleteStudent,
} from "../controllers/adminController.js";
import {
  validateAdminUpdateInput,
  validateAdminLoginInput,
  validateAdminRegisterInput,
  validateDate,
  validateAddStudentInput,
  validateIdParam,
} from "../middleware/validationMiddleware.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

router.post("/register", validateAdminRegisterInput, register);
router.post("/login", validateAdminLoginInput, login);
router.patch(
  "/update-info",
  authenticateUser,
  validateAdminUpdateInput,
  updateInfo
);

router.post(
  "/preliminaryVoteDate",
  authenticateUser,
  validateDate,
  setPreliminaryVotingDates
);
router.post(
  "/voterRegistrationDate",
  authenticateUser,
  validateDate,
  setVoterRegistrationDates
);
router.post(
  "/mainVotingDate",
  authenticateUser,
  validateDate,
  setMainVotingDates
);

router.post("/student", authenticateUser, validateAddStudentInput, addStudent);
router.delete("/student/:id", authenticateUser, validateIdParam, deleteStudent);

export default router;
