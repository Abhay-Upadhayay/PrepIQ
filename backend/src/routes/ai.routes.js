import express from "express";
import { 
    generateForWeakAreas, 
    getMyAIQuestions 
} from "../controllers/ai.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateForWeakAreas);
router.get("/my-questions", authMiddleware, getMyAIQuestions);

export default router;