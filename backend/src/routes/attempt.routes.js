import express from "express";
import { 
    startSession, 
    submitSession, 
    getMyAttempts,
    getSessionById
} from "../controllers/attempt.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/start", authMiddleware, startSession);
router.post("/submit/:sessionId", authMiddleware, submitSession);
router.get("/my", authMiddleware, getMyAttempts);
router.get("/:sessionId", authMiddleware, getSessionById);

export default router;