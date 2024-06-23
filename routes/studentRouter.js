import { Router } from "express";
const router = Router();
import {
  getAllStudents,
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
  validateStudentInput,
} from "../middleware/validationMiddleware.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import rateLimiter from "express-rate-limit";

// const apiLimiter = rateLimiter({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 15,
//   message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
// });
router.post("/register", validateStudentInput, register);
router.post("/login", validateStudentInput, login);
router.get("/allStudents", authenticateUser, getAllStudents);
router.post("/prevote/:id", authenticateUser, validateIdParam, preliminaryVote);
router.get("/candidates", authenticateUser, getCandidates);
router.post("/candidates/:id", authenticateUser, validateIdParam, mainVote);
router.get("/result", authenticateUser, getResult);
router.get("/stats", authenticateUser, getStats);
export default router;
