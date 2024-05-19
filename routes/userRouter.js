import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { getCurrentUser } from "../controllers/userController.js";
const router = Router();

router.get("/current-user", authenticateUser, getCurrentUser);
export default router;
