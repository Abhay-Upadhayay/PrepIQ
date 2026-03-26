import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchStats = createAsyncThunk("analytics/fetchStats", async (_, { rejectWithValue }) => {
    try {
        const [stats, weakAreas, subjectWise, recentSessions] = await Promise.all([
            api.get("/analytics/stats"),
            api.get("/analytics/weak-areas"),
            api.get("/analytics/subject-wise"),
            api.get("/analytics/recent-sessions")
        ]);
        return {
            stats: stats.data,
            weakAreas: weakAreas.data.weakAreas,
            subjectWise: subjectWise.data.stats,
            recentSessions: recentSessions.data.sessions
        };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch analytics");
    }
});

export const generateAIQuestions = createAsyncThunk("analytics/generateAI", async (_, { rejectWithValue }) => {
    try {
        const res = await api.post("/ai/generate");
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to generate AI questions");
    }
});

export const fetchAIQuestions = createAsyncThunk("analytics/fetchAI", async (params, { rejectWithValue }) => {
    try {
        const res = await api.get("/ai/my-questions", { params });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch AI questions");
    }
});

const analyticsSlice = createSlice({
    name: "analytics",
    initialState: {
        heatmap: {},
        totalActiveDays: 0,
        maxStreak: 0,
        stats: null,
        weakAreas: [],
        subjectWise: [],
        recentSessions: [],
        aiQuestions: [],
        loading: false,
        aiLoading: false,
        error: null
    },
    reducers: {
        clearAnalytics: (state) => {
            state.stats = null;
            state.weakAreas = [];
            state.subjectWise = [];
            state.recentSessions = [];
            state.aiQuestions = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all stats
            .addCase(fetchStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
                state.weakAreas = action.payload.weakAreas;
                state.subjectWise = action.payload.subjectWise;
                state.recentSessions = action.payload.recentSessions;
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Generate AI questions
            .addCase(generateAIQuestions.pending, (state) => {
                state.aiLoading = true;
            })
            .addCase(generateAIQuestions.fulfilled, (state, action) => {
                state.aiLoading = false;
                state.aiQuestions = action.payload.questions;
            })
            .addCase(generateAIQuestions.rejected, (state, action) => {
                state.aiLoading = false;
                state.error = action.payload;
            })
            // Fetch AI questions
            .addCase(fetchAIQuestions.pending, (state) => {
                state.aiLoading = true;
            })
            .addCase(fetchAIQuestions.fulfilled, (state, action) => {
                state.aiLoading = false;
                state.aiQuestions = action.payload.questions;
            })
            .addCase(fetchAIQuestions.rejected, (state, action) => {
                state.aiLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchHeatmap.fulfilled, (state, action) => {
                state.heatmap = action.payload.heatmap;
                state.totalActiveDays = action.payload.totalActiveDays;
                state.maxStreak = action.payload.maxStreak;
            })
    }
});

export const fetchHeatmap = createAsyncThunk("analytics/heatmap", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/analytics/heatmap");
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message);
    }
});

export const { clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
