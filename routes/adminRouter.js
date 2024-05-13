import { Router } from "express";
const router = Router();

import {
  register,
  login,
  updateInfo,
  setMainVotingDates,
  setPreliminaryVotingDates,
  setVoterRegistrationDates,
} from "../controllers/adminController.js";
import {
  validateAdminUpdateInput,
  validateAdminLoginInput,
  validateAdminRegisterInput,
  validateDate,
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

export default router;
