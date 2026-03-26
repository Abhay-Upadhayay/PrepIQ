import express from "express";
import {
    getMyStats,
    getWeakAreas,
    getSubjectWiseStats,
    getRecentSessions,
    getHeatmapData
} from "../controllers/analytics.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, getMyStats);
router.get("/weak-areas", authMiddleware, getWeakAreas);
router.get("/subject-wise", authMiddleware, getSubjectWiseStats);
router.get("/recent-sessions", authMiddleware, getRecentSessions);
router.get("/heatmap", authMiddleware, getHeatmapData);

export default router;