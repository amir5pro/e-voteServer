import { Router } from "express";
import { logout } from "../controllers/logoutController.js";
const router = Router();

router.get("/", logout);
export default router;
