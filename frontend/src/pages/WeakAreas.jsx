import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStats, generateAIQuestions, fetchAIQuestions } from "../store/slices/analyticsSlice";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";

const WeakAreas = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { weakAreas, aiQuestions, loading, aiLoading } = useSelector(state => state.analytics);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    useEffect(() => {
        dispatch(fetchStats());
        dispatch(fetchAIQuestions());
    }, []);

    const handleGenerate = async () => {
        if (weakAreas.length === 0) {
            return toast.error("No weak areas found. Attempt more exams first.");
        }
        const result = await dispatch(generateAIQuestions());
        if (generateAIQuestions.fulfilled.match(result)) {
            toast.success(`Generated ${result.payload.questions.length} new questions!`);
            dispatch(fetchAIQuestions());
        } else {
            toast.error("Failed to generate questions");
        }
    };

    const getAccuracyColor = (acc) => {
        if (acc >= 75) return "#22c55e";
        if (acc >= 50) return "#f59e0b";
        return "#ef4444";
    };

    const getAccuracyLabel = (acc) => {
        if (acc >= 75) return "Strong";
        if (acc >= 50) return "Average";
        return "Weak";
    };

    const filteredAIQuestions = selectedTopic
        ? aiQuestions.filter(q => q.topic === selectedTopic)
        : aiQuestions;

    if (loading) return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0a0f1a" }}
            className="flex items-center justify-center">
            <Loader size="lg" />
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0a0f1a" }}>

            {/* Navbar */}
            <nav style={{
                backgroundColor: "#0d1117",
                borderBottom: "1px solid #1e293b",
                padding: "12px 32px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                position: "sticky", top: 0, zIndex: 50
            }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#6366f1", cursor: "pointer" }}
                    onClick={() => navigate("/dashboard")}>
                    PrepIQ
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                    {[
                        { label: "Dashboard", path: "/dashboard" },
                        { label: "Practice", path: "/exam/setup" },
                        { label: "Weak Areas", path: "/weak-areas" },
                        { label: "History", path: "/history" },
                    ].map(item => (
                        <button key={item.label} onClick={() => navigate(item.path)}
                            style={{
                                background: "none", border: "none",
                                color: item.path === "/weak-areas" ? "#a5b4fc" : "#64748b",
                                fontSize: 14, cursor: "pointer",
                                fontWeight: item.path === "/weak-areas" ? 600 : 500,
                                padding: "6px 14px", borderRadius: 8
                            }}>
                            {item.label}
                        </button>
                    ))}
                </div>
                <button onClick={() => navigate("/exam/setup")}
                    style={{
                        backgroundColor: "#6366f1", color: "white",
                        border: "none", borderRadius: 8,
                        padding: "8px 18px", fontWeight: 600,
                        fontSize: 13, cursor: "pointer"
                    }}>
                    Start Practice →
                </button>
            </nav>

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9" }}>
                            Weak Areas
                        </h1>
                        <p style={{ fontSize: 14, color: "#475569", marginTop: 4 }}>
                            Topics where you score below 50% — focus here to improve fast
                        </p>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={aiLoading}
                        style={{
                            display: "flex", alignItems: "center", gap: 8,
                            backgroundColor: aiLoading ? "#1e293b" : "rgba(99,102,241,0.1)",
                            color: "#a5b4fc",
                            border: "1px solid rgba(99,102,241,0.3)",
                            borderRadius: 10, padding: "10px 20px",
                            fontWeight: 600, fontSize: 13,
                            cursor: aiLoading ? "not-allowed" : "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        {aiLoading ? <Loader size="sm" /> : "⚡ Generate AI Questions"}
                    </button>
                </div>

                {/* Main grid */}
                <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 }}>

                    {/* Left — weak topics list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <h2 style={{ fontSize: 13, fontWeight: 600, color: "#475569",
                            textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                            Topics ({weakAreas.length})
                        </h2>

                        {weakAreas.length === 0 ? (
                            <div style={{
                                backgroundColor: "#1e293b",
                                border: "1px solid #334155",
                                borderRadius: 16, padding: "40px 24px",
                                textAlign: "center"
                            }}>
                                <span style={{ fontSize: 32 }}>🎯</span>
                                <p style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600, marginTop: 12 }}>
                                    No weak areas found
                                </p>
                                <p style={{ color: "#475569", fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
                                    Attempt at least 3 questions<br />per topic to see weak areas
                                </p>
                                <button onClick={() => navigate("/exam/setup")}
                                    style={{
                                        marginTop: 16, padding: "10px 20px",
                                        backgroundColor: "#6366f1", color: "white",
                                        border: "none", borderRadius: 8,
                                        fontWeight: 600, fontSize: 13, cursor: "pointer"
                                    }}>
                                    Start Practicing
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* All topics filter */}
                                <button
                                    onClick={() => setSelectedTopic(null)}
                                    style={{
                                        display: "flex", alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "12px 16px", borderRadius: 12,
                                        border: `1px solid ${!selectedTopic ? "#6366f1" : "#334155"}`,
                                        backgroundColor: !selectedTopic ? "rgba(99,102,241,0.08)" : "#1e293b",
                                        cursor: "pointer", textAlign: "left"
                                    }}
                                >
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>
                                            All Topics
                                        </p>
                                        <p style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                                            {aiQuestions.length} AI questions available
                                        </p>
                                    </div>
                                    <span style={{ fontSize: 18, color: "#6366f1" }}>⚡</span>
                                </button>

                                {weakAreas.map((area, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedTopic(
                                            selectedTopic === area.topic ? null : area.topic
                                        )}
                                        style={{
                                            display: "flex", flexDirection: "column",
                                            padding: "14px 16px", borderRadius: 12,
                                            border: `1px solid ${selectedTopic === area.topic ? "#6366f1" : "#334155"}`,
                                            backgroundColor: selectedTopic === area.topic
                                                ? "rgba(99,102,241,0.08)" : "#1e293b",
                                            cursor: "pointer", textAlign: "left",
                                            transition: "all 0.15s"
                                        }}
                                    >
                                        {/* Topic name + accuracy */}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div>
                                                <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>
                                                    {area.topic}
                                                </p>
                                                <p style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                                                    {area.subject} · {area.totalAttempts} attempts
                                                </p>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <span style={{
                                                    fontSize: 13, fontWeight: 700,
                                                    color: getAccuracyColor(area.accuracyPercent)
                                                }}>
                                                    {area.accuracyPercent}%
                                                </span>
                                                <p style={{
                                                    fontSize: 10, marginTop: 2,
                                                    color: getAccuracyColor(area.accuracyPercent)
                                                }}>
                                                    {getAccuracyLabel(area.accuracyPercent)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Accuracy progress bar */}
                                        <div style={{
                                            marginTop: 10, height: 4,
                                            backgroundColor: "#0f172a",
                                            borderRadius: 4, overflow: "hidden"
                                        }}>
                                            <div style={{
                                                height: "100%",
                                                width: `${area.accuracyPercent}%`,
                                                backgroundColor: getAccuracyColor(area.accuracyPercent),
                                                borderRadius: 4,
                                                transition: "width 0.5s ease"
                                            }} />
                                        </div>

                                        {/* Correct / Wrong counts */}
                                        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                                            <span style={{ fontSize: 11, color: "#22c55e" }}>
                                                ✓ {area.correctCount} correct
                                            </span>
                                            <span style={{ fontSize: 11, color: "#ef4444" }}>
                                                ✗ {area.totalAttempts - area.correctCount} wrong
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Right — AI generated questions */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                            <h2 style={{ fontSize: 13, fontWeight: 600, color: "#475569",
                                textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                AI Generated Questions
                                {selectedTopic && (
                                    <span style={{ color: "#6366f1", marginLeft: 8, textTransform: "none", fontSize: 12 }}>
                                        — {selectedTopic}
                                    </span>
                                )}
                            </h2>
                            <span style={{ fontSize: 12, color: "#475569" }}>
                                {filteredAIQuestions.length} questions
                            </span>
                        </div>

                        {aiLoading ? (
                            <div style={{
                                backgroundColor: "#1e293b",
                                border: "1px solid #334155",
                                borderRadius: 16, padding: "60px 24px",
                                display: "flex", flexDirection: "column",
                                alignItems: "center", gap: 16
                            }}>
                                <Loader size="lg" />
                                <p style={{ color: "#475569", fontSize: 14 }}>
                                    AI is generating questions for your weak areas...
                                </p>
                            </div>
                        ) : filteredAIQuestions.length === 0 ? (
                            <div style={{
                                backgroundColor: "#1e293b",
                                border: "1px solid #334155",
                                borderRadius: 16, padding: "60px 24px",
                                textAlign: "center"
                            }}>
                                <span style={{ fontSize: 36 }}>🤖</span>
                                <p style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 600, marginTop: 16 }}>
                                    No AI questions yet
                                </p>
                                <p style={{ color: "#475569", fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
                                    Click "Generate AI Questions" to create<br />
                                    personalized questions for your weak topics
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                {filteredAIQuestions.map((q, i) => (
                                    <div key={i} style={{
                                        backgroundColor: "#1e293b",
                                        border: "1px solid #334155",
                                        borderRadius: 14, overflow: "hidden"
                                    }}>
                                        {/* Question header */}
                                        <button
                                            onClick={() => setExpandedQuestion(expandedQuestion === i ? null : i)}
                                            style={{
                                                width: "100%", padding: "16px 20px",
                                                display: "flex", alignItems: "flex-start",
                                                justifyContent: "space-between", gap: 12,
                                                background: "none", border: "none",
                                                cursor: "pointer", textAlign: "left"
                                            }}
                                        >
                                            <div style={{ display: "flex", gap: 12, flex: 1 }}>
                                                <span style={{
                                                    flexShrink: 0,
                                                    width: 24, height: 24,
                                                    backgroundColor: "rgba(99,102,241,0.15)",
                                                    color: "#a5b4fc",
                                                    borderRadius: 6,
                                                    display: "flex", alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: 11, fontWeight: 700
                                                }}>
                                                    {i + 1}
                                                </span>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontSize: 13, color: "#f1f5f9", lineHeight: 1.6 }}>
                                                        {q.questionText}
                                                    </p>
                                                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                                                        <span style={{
                                                            fontSize: 10, color: "#a5b4fc",
                                                            backgroundColor: "rgba(99,102,241,0.1)",
                                                            padding: "2px 8px", borderRadius: 4
                                                        }}>
                                                            {q.topic}
                                                        </span>
                                                        <span style={{
                                                            fontSize: 10, color: "#64748b",
                                                            backgroundColor: "#0f172a",
                                                            padding: "2px 8px", borderRadius: 4
                                                        }}>
                                                            AI Generated
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span style={{
                                                color: "#475569", fontSize: 16, flexShrink: 0,
                                                transform: expandedQuestion === i ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: "transform 0.2s"
                                            }}>
                                                ▾
                                            </span>
                                        </button>

                                        {/* Expanded — options + answer */}
                                        {expandedQuestion === i && (
                                            <div style={{
                                                padding: "0 20px 20px",
                                                borderTop: "1px solid #0f172a"
                                            }}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
                                                    {q.options.map((opt, j) => {
                                                        const letter = ["A", "B", "C", "D"][j];
                                                        const isCorrect = letter === q.correctOption;
                                                        return (
                                                            <div key={j} style={{
                                                                display: "flex", alignItems: "center", gap: 10,
                                                                padding: "10px 14px", borderRadius: 8,
                                                                backgroundColor: isCorrect
                                                                    ? "rgba(34,197,94,0.08)" : "#0f172a",
                                                                border: `1px solid ${isCorrect
                                                                    ? "rgba(34,197,94,0.3)" : "#1e293b"}`
                                                            }}>
                                                                <span style={{
                                                                    width: 22, height: 22, borderRadius: 5,
                                                                    display: "flex", alignItems: "center",
                                                                    justifyContent: "center",
                                                                    fontSize: 10, fontWeight: 700, flexShrink: 0,
                                                                    backgroundColor: isCorrect
                                                                        ? "rgba(34,197,94,0.2)" : "#1e293b",
                                                                    color: isCorrect ? "#86efac" : "#475569"
                                                                }}>
                                                                    {letter}
                                                                </span>
                                                                <span style={{
                                                                    fontSize: 13,
                                                                    color: isCorrect ? "#86efac" : "#94a3b8"
                                                                }}>
                                                                    {opt}
                                                                </span>
                                                                {isCorrect && (
                                                                    <span style={{
                                                                        marginLeft: "auto", fontSize: 11,
                                                                        color: "#22c55e", fontWeight: 600
                                                                    }}>
                                                                        ✓ Correct
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Explanation */}
                                                {q.explanation && (
                                                    <div style={{
                                                        marginTop: 14,
                                                        backgroundColor: "rgba(99,102,241,0.05)",
                                                        border: "1px solid rgba(99,102,241,0.15)",
                                                        borderRadius: 8, padding: "12px 14px"
                                                    }}>
                                                        <p style={{ fontSize: 11, color: "#6366f1",
                                                            fontWeight: 600, marginBottom: 4 }}>
                                                            💡 EXPLANATION
                                                        </p>
                                                        <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
                                                            {q.explanation}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeakAreas;