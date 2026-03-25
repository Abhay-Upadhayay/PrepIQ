import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { submitExam, setAnswer } from "../store/slices/examSlice";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";

// ── Timer component ──────────────────────────────────────────────
const ExamTimer = ({ startTime, durationSeconds, onTimeUp }) => {
    const calculateTimeLeft = () => {
        const elapsed = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
        return Math.max(0, durationSeconds - elapsed);
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);
            if (remaining <= 0) { clearInterval(interval); onTimeUp(); }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const format = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    const percent = (timeLeft / durationSeconds) * 100;
    const color = timeLeft > 300 ? "#22c55e" : timeLeft > 60 ? "#f59e0b" : "#ef4444";

    return (
        <div className="flex items-center gap-3">
            {/* Circular progress */}
            <div style={{ position: "relative", width: 48, height: 48 }}>
                <svg width="48" height="48" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="24" cy="24" r="20" fill="none" stroke="#1e293b" strokeWidth="3" />
                    <circle cx="24" cy="24" r="20" fill="none" stroke={color} strokeWidth="3"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - percent / 100)}`}
                        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
                    />
                </svg>
                <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    {timeLeft <= 60 && (
                        <span style={{ fontSize: 10, fontWeight: 700, color }}>!</span>
                    )}
                </div>
            </div>
            <div>
                <p style={{ fontSize: 11, color: "#475569", marginBottom: 1 }}>Time Left</p>
                <p style={{
                    fontSize: 20, fontWeight: 700, color,
                    fontFamily: "monospace",
                    animation: timeLeft <= 60 ? "pulse 1s infinite" : "none"
                }}>
                    {format(timeLeft)}
                </p>
            </div>
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

// ── Main Exam Page ───────────────────────────────────────────────
const ExamPage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { questions, answers, startTime, durationSeconds, loading, sessionId: storeSessionId }
        = useSelector(state => state.exam);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const submitLock = useRef(false);

    // Guard — if no session in store, redirect to setup
    useEffect(() => {
        if (!storeSessionId || questions.length === 0) {
            toast.error("No active session found");
            navigate("/exam/setup");
        }
    }, []);

    const currentQuestion = questions[currentIndex];
    const answeredCount = Object.keys(answers).length;
    const unansweredCount = questions.length - answeredCount;

    const handleAnswer = (option) => {
        if (submitted) return;
        dispatch(setAnswer({ questionId: currentQuestion._id, option }));
    };

    const handleSubmit = async () => {
        if (submitLock.current || submitted) return;
        submitLock.current = true;
        setSubmitted(true);
        setShowConfirm(false);

        const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
            questionId,
            selectedOption
        }));

        const result = await dispatch(submitExam({ sessionId, answers: formattedAnswers }));

        if (submitExam.fulfilled.match(result)) {
            navigate(`/results/${sessionId}`);
        } else {
            toast.error("Submission failed. Try again.");
            setSubmitted(false);
            submitLock.current = false;
        }
    };

    const handleTimeUp = () => {
        toast("⏰ Time's up! Auto-submitting...", { icon: "⏰" });
        handleSubmit();
    };

    if (!currentQuestion) return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0f172a" }}
            className="flex items-center justify-center">
            <Loader size="lg" />
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", display: "flex", flexDirection: "column" }}>

            {/* ── Top bar ── */}
            <div style={{
                backgroundColor: "#0d1117",
                borderBottom: "1px solid #1e293b",
                padding: "12px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                position: "sticky", top: 0, zIndex: 50
            }}>
                {/* Left — session info */}
                <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-lg">PrepIQ</span>
                    <div style={{ width: 1, height: 20, backgroundColor: "#1e293b" }} />
                    <span style={{
                        fontSize: 12, color: "#a5b4fc",
                        backgroundColor: "rgba(99,102,241,0.1)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        padding: "3px 10px", borderRadius: 100
                    }}>
                        {questions[0]?.subject}
                    </span>
                </div>

                {/* Center — progress */}
                <div className="flex items-center gap-3">
                    <span style={{ fontSize: 13, color: "#64748b" }}>
                        {answeredCount}/{questions.length} answered
                    </span>
                    <div style={{
                        width: 120, height: 4, backgroundColor: "#1e293b", borderRadius: 4, overflow: "hidden"
                    }}>
                        <div style={{
                            height: "100%", borderRadius: 4,
                            backgroundColor: "#6366f1",
                            width: `${(answeredCount / questions.length) * 100}%`,
                            transition: "width 0.3s"
                        }} />
                    </div>
                </div>

                {/* Right — timer */}
                {startTime && durationSeconds && (
                    <ExamTimer
                        startTime={startTime}
                        durationSeconds={durationSeconds}
                        onTimeUp={handleTimeUp}
                    />
                )}
            </div>

            {/* ── Main content ── */}
            <div style={{ flex: 1, display: "flex", maxWidth: 1100, margin: "0 auto", width: "100%", padding: "32px 24px", gap: 24 }}>

                {/* Left — Question */}
                <div style={{ flex: 1 }}>
                    {/* Question number + difficulty */}
                    <div className="flex items-center gap-3 mb-6">
                        <span style={{
                            backgroundColor: "#6366f1", color: "white",
                            fontSize: 12, fontWeight: 700,
                            padding: "4px 12px", borderRadius: 100
                        }}>
                            Q{currentIndex + 1}
                        </span>
                        <span style={{
                            fontSize: 11, color: "#64748b",
                            backgroundColor: "#1e293b",
                            padding: "3px 10px", borderRadius: 100,
                            textTransform: "capitalize"
                        }}>
                            {currentQuestion.difficulty}
                        </span>
                        <span style={{
                            fontSize: 11, color: "#64748b",
                            backgroundColor: "#1e293b",
                            padding: "3px 10px", borderRadius: 100
                        }}>
                            {currentQuestion.topic}
                        </span>
                    </div>

                    {/* Question text */}
                    <div style={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: 16, padding: "28px 32px",
                        marginBottom: 20
                    }}>
                        <p style={{ color: "#f1f5f9", fontSize: 16, lineHeight: 1.7 }}>
                            {currentQuestion.questionText}
                        </p>
                    </div>

                    {/* Options */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {currentQuestion.options.map((option, i) => {
                            const letter = ["A", "B", "C", "D"][i];
                            const isSelected = answers[currentQuestion._id] === letter;

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(letter)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 16,
                                        padding: "16px 20px", borderRadius: 12,
                                        border: `1px solid ${isSelected ? "#6366f1" : "#334155"}`,
                                        backgroundColor: isSelected ? "rgba(99,102,241,0.1)" : "#1e293b",
                                        cursor: "pointer", textAlign: "left",
                                        transition: "all 0.15s",
                                        transform: isSelected ? "translateX(4px)" : "translateX(0)"
                                    }}
                                >
                                    {/* Letter badge */}
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        backgroundColor: isSelected ? "#6366f1" : "#0f172a",
                                        color: isSelected ? "white" : "#475569",
                                        fontSize: 13, fontWeight: 700,
                                        border: `1px solid ${isSelected ? "#6366f1" : "#334155"}`
                                    }}>
                                        {letter}
                                    </div>
                                    <span style={{
                                        color: isSelected ? "#f1f5f9" : "#94a3b8",
                                        fontSize: 14, lineHeight: 1.5
                                    }}>
                                        {option}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Prev / Next navigation */}
                    <div className="flex justify-between mt-8">
                        <button
                            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                            disabled={currentIndex === 0}
                            style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "10px 20px", borderRadius: 10,
                                border: "1px solid #334155",
                                backgroundColor: "transparent",
                                color: currentIndex === 0 ? "#334155" : "#94a3b8",
                                cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                                fontSize: 14
                            }}
                        >
                            ← Previous
                        </button>

                        {currentIndex < questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentIndex(i => i + 1)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "10px 20px", borderRadius: 10,
                                    border: "1px solid #334155",
                                    backgroundColor: "#1e293b",
                                    color: "#f1f5f9",
                                    cursor: "pointer", fontSize: 14
                                }}
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowConfirm(true)}
                                style={{
                                    padding: "10px 24px", borderRadius: 10,
                                    backgroundColor: "#6366f1",
                                    color: "white", fontWeight: 600,
                                    border: "none", cursor: "pointer", fontSize: 14,
                                    boxShadow: "0 4px 16px rgba(99,102,241,0.3)"
                                }}
                            >
                                Submit Exam
                            </button>
                        )}
                    </div>
                </div>

                {/* Right — Question palette */}
                <div style={{ width: 220, flexShrink: 0 }}>
                    <div style={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: 16, padding: 20,
                        position: "sticky", top: 90
                    }}>
                        <p style={{ fontSize: 12, color: "#475569", fontWeight: 600,
                            textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
                            Questions
                        </p>

                        {/* Legend */}
                        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                            <div className="flex items-center gap-1.5">
                                <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: "#6366f1" }} />
                                <span style={{ fontSize: 11, color: "#475569" }}>Answered</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: "#1e293b",
                                    border: "1px solid #334155" }} />
                                <span style={{ fontSize: 11, color: "#475569" }}>Pending</span>
                            </div>
                        </div>

                        {/* Grid of question numbers */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                            {questions.map((q, i) => {
                                const isAnswered = !!answers[q._id];
                                const isCurrent = i === currentIndex;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIndex(i)}
                                        style={{
                                            width: "100%", aspectRatio: "1",
                                            borderRadius: 8, fontSize: 12, fontWeight: 600,
                                            cursor: "pointer",
                                            backgroundColor: isCurrent ? "#6366f1"
                                                : isAnswered ? "rgba(99,102,241,0.2)"
                                                : "#0f172a",
                                            color: isCurrent ? "white"
                                                : isAnswered ? "#a5b4fc"
                                                : "#475569",
                                            border: `1px solid ${isCurrent ? "#6366f1"
                                                : isAnswered ? "rgba(99,102,241,0.3)"
                                                : "#334155"}`,
                                            transition: "all 0.15s"
                                        }}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Submit button in sidebar */}
                        <button
                            onClick={() => setShowConfirm(true)}
                            disabled={submitted || loading}
                            style={{
                                width: "100%", marginTop: 20,
                                padding: "12px", borderRadius: 10,
                                backgroundColor: "#6366f1",
                                color: "white", fontWeight: 600,
                                border: "none", cursor: "pointer", fontSize: 13,
                                opacity: submitted || loading ? 0.6 : 1
                            }}
                        >
                            {loading ? <Loader size="sm" /> : "Submit"}
                        </button>

                        {/* Unanswered warning */}
                        {unansweredCount > 0 && (
                            <p style={{ fontSize: 11, color: "#f59e0b", textAlign: "center", marginTop: 10 }}>
                                {unansweredCount} question{unansweredCount > 1 ? "s" : ""} unanswered
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Confirm submit modal ── */}
            {showConfirm && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 100,
                    backgroundColor: "rgba(0,0,0,0.7)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <div style={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: 20, padding: 32,
                        maxWidth: 400, width: "100%", margin: "0 24px"
                    }}>
                        <h3 style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                            Submit Exam?
                        </h3>
                        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 8 }}>
                            You have answered {answeredCount} out of {questions.length} questions.
                        </p>
                        {unansweredCount > 0 && (
                            <p style={{
                                color: "#f59e0b", fontSize: 13,
                                backgroundColor: "rgba(245,158,11,0.1)",
                                border: "1px solid rgba(245,158,11,0.2)",
                                borderRadius: 8, padding: "8px 12px", marginBottom: 20
                            }}>
                                ⚠️ {unansweredCount} question{unansweredCount > 1 ? "s" : ""} still unanswered
                            </p>
                        )}
                        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                            <button
                                onClick={() => setShowConfirm(false)}
                                style={{
                                    flex: 1, padding: "12px", borderRadius: 10,
                                    border: "1px solid #334155", backgroundColor: "transparent",
                                    color: "#94a3b8", cursor: "pointer", fontSize: 14
                                }}
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                style={{
                                    flex: 1, padding: "12px", borderRadius: 10,
                                    backgroundColor: "#6366f1", border: "none",
                                    color: "white", fontWeight: 600,
                                    cursor: "pointer", fontSize: 14
                                }}
                            >
                                Yes, Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamPage;