import { Router } from "express";
import {
  addInfo,
  addPhoto,
  getCandidateInfo,
  login,
} from "../controllers/candidateController.js";
import {
  validateCandidateInput,
  validateIdParam,
  validateStudentInput,
} from "../middleware/validationMiddleware.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMIddleware.js";
const router = Router();

router.post("/login", validateStudentInput, login);
router.post("/addInfo", authenticateUser, validateCandidateInput, addInfo);
router.patch("/addPhoto", authenticateUser, upload.single("avatar"), addPhoto);
router.get("/getInfo/:id", authenticateUser, validateIdParam, getCandidateInfo);

export default router;
