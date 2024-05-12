import { Router } from "express";
const router = Router();

import { register, login, updateInfo } from "../controllers/adminController.js";
import {
  validateAdminLoginInput,
  validateAdminRegisterInput,
} from "../middleware/validationMiddleware.js";

router.post("/register", validateAdminRegisterInput, register);
router.post("/login", validateAdminLoginInput, login);
router.patch("/update-info", updateInfo);

export default router;
