import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ExamSetup from "./pages/ExamSetup";
import ExamPage from "./pages/ExamPage";
import Results from "./pages/Results";
import WeakAreas from "./pages/WeakAreas";
import History from "./pages/History";

const App = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/exam/setup" element={
                <ProtectedRoute><ExamSetup /></ProtectedRoute>
            } />
            <Route path="/exam/:sessionId" element={
                <ProtectedRoute><ExamPage /></ProtectedRoute>
            } />
            <Route path="/results/:sessionId" element={
                <ProtectedRoute><Results /></ProtectedRoute>
            } />
            <Route path="/weak-areas" element={
                <ProtectedRoute><WeakAreas /></ProtectedRoute>
            } />
            <Route path="/history" element={
                <ProtectedRoute><History /></ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default App;
