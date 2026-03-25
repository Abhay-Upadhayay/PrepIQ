import express from "express";
import {
    getMyStats,
    getWeakAreas,
    getSubjectWiseStats,
    getRecentSessions
} from "../controllers/analytics.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, getMyStats);
router.get("/weak-areas", authMiddleware, getWeakAreas);
router.get("/subject-wise", authMiddleware, getSubjectWiseStats);
router.get("/recent-sessions", authMiddleware, getRecentSessions);

export default router;