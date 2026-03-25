import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import examReducer from "./slices/examSlice";
import analyticsReducer from "./slices/analyticsSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        exam: examReducer,
        analytics: analyticsReducer
    }
});
