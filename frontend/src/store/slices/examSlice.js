import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const startExam = createAsyncThunk("exam/start", async (data, { rejectWithValue }) => {
    try {
        const res = await api.post("/attempts/start", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to start exam");
    }
});

export const submitExam = createAsyncThunk("exam/submit", async ({ sessionId, answers }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/attempts/submit/${sessionId}`, { answers });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to submit exam");
    }
});

const examSlice = createSlice({
    name: "exam",
    initialState: {
        sessionId: null,
        startTime: null,
        durationSeconds: null,
        questions: [],
        answers: {},
        result: null,
        loading: false,
        error: null
    },
    reducers: {
        setAnswer: (state, action) => {
            const { questionId, option } = action.payload;
            state.answers[questionId] = option;
        },
        clearExam: (state) => {
            state.sessionId = null;
            state.startTime = null;
            state.durationSeconds = null;
            state.questions = [];
            state.answers = {};
            state.result = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Start exam
            .addCase(startExam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(startExam.fulfilled, (state, action) => {
                state.loading = false;
                state.sessionId = action.payload.sessionId;
                state.startTime = action.payload.startTime;
                state.durationSeconds = action.payload.durationSeconds;
                state.questions = action.payload.questions;
                state.answers = {};
                state.result = null;
            })
            .addCase(startExam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Submit exam
            .addCase(submitExam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitExam.fulfilled, (state, action) => {
                state.loading = false;
                state.result = action.payload;
            })
            .addCase(submitExam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setAnswer, clearExam } = examSlice.actions;
export default examSlice.reducer;