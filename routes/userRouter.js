import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { getCurrentUser, getDates } from "../controllers/userController.js";
const router = Router();

router.get("/current-user", authenticateUser, getCurrentUser);
router.get("/dates", authenticateUser, getDates);
export default router;
