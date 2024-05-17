import { Router } from "express";
import {
  addInfo,
  getCandidateInfo,
  login,
} from "../controllers/candidateController.js";
import {
  validateCandidateInput,
  validateIdParam,
  validateStudentInput,
} from "../middleware/validationMiddleware.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/login", validateStudentInput, login);
router.post("/addInfo", authenticateUser, validateCandidateInput, addInfo);
router.get("/getInfo/:id", authenticateUser, validateIdParam, getCandidateInfo);

export default router;
