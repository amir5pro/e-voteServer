import { Router } from "express";
const router = Router();
import {
  getCandidates,
  getResult,
  getStats,
  login,
  mainVote,
  preliminaryVote,
  register,
} from "../controllers/studentController.js";
import {
  validateIdParam,
  validateVoterInput,
} from "../middleware/validationMiddleware.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
router.post("/register", validateVoterInput, register);
router.post("/login", validateVoterInput, login);
router.post("/prevote/:id", authenticateUser, validateIdParam, preliminaryVote);
router.get("/candidates", authenticateUser, getCandidates);
router.post("/candidates/:id", authenticateUser, validateIdParam, mainVote);
router.get("/result", authenticateUser, getResult);
router.get("/stats", authenticateUser, getStats);
export default router;
