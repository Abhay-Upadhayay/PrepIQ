import express from "express";
import { 
    addQuestion, 
    getQuestions, 
    getQuestionById,
    deleteQuestion 
} from "../controllers/question.controller.js";
import  { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, addQuestion);        // admin adds question
router.get("/", authMiddleware, getQuestions);        // fetch with filters
router.get("/:id", authMiddleware, getQuestionById);  // single question
router.delete("/:id", authMiddleware, deleteQuestion); // admin deletes

export default router;