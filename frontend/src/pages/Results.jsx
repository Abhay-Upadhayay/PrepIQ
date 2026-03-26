import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearExam } from "../store/slices/examSlice";

const Results = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { result, questions } = useSelector(state => state.exam);

    // If no result in store, redirect to dashboard
    useEffect(() => {
        if (!result) navigate("/dashboard");
    }, []);

    if (!result) return null;

    const { score, total, percentage, results } = result;

    const getGrade = () => {
        if (percentage >= 90) return { label: "Excellent!", color: "#22c55e", bg: "rgba(34,197,94,0.1)" };
        if (percentage >= 75) return { label: "Great Job!", color: "#6366f1", bg: "rgba(99,102,241,0.1)" };
        if (percentage >= 50) return { label: "Good Effort", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
        return { label: "Keep Practicing", color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
    };

    const grade = getGrade();
    const correctCount = results.filter(r => r.isCorrect).length;
    const wrongCount = results.filter(r => !r.isCorrect).length;
    const skippedCount = results.filter(r => !r.selectedOption).length;

    const handleRetry = () => {
        dispatch(clearExam());
        navigate("/exam/setup");
    };

    const handleDashboard = () => {
        dispatch(clearExam());
        navigate("/dashboard");
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0f172a" }} className="px-4 py-10">
            <div className="max-w-3xl mx-auto">

                {/* Score card */}
                <div style={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: 20, padding: "40px 32px",
                    textAlign: "center", marginBottom: 24
                }}>
                    {/* Grade badge */}
                    <div style={{
                        display: "inline-block",
                        backgroundColor: grade.bg,
                        color: grade.color,
                        border: `1px solid ${grade.color}30`,
                        borderRadius: 100, padding: "6px 20px",
                        fontSize: 13, fontWeight: 600, marginBottom: 20
                    }}>
                        {grade.label}
                    </div>

                    {/* Score circle */}
                    <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}>
                        <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
                            <circle cx="80" cy="80" r="70" fill="none" stroke="#334155" strokeWidth="10" />
                            <circle cx="80" cy="80" r="70" fill="none" stroke={grade.color}
                                strokeWidth="10"
                                strokeDasharray={`${2 * Math.PI * 70}`}
                                strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentage / 100)}`}
                                strokeLinecap="round"
                                style={{ transition: "stroke-dashoffset 1s ease" }}
                            />
                        </svg>
                        <div style={{
                            position: "absolute", inset: 0,
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center"
                        }}>
                            <span style={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9" }}>
                                {percentage}%
                            </span>
                            <span style={{ fontSize: 13, color: "#475569" }}>
                                {score}/{total}
                            </span>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
                        {[
                            { label: "Correct", value: correctCount, color: "#22c55e" },
                            { label: "Wrong", value: wrongCount, color: "#ef4444" },
                            { label: "Skipped", value: skippedCount, color: "#f59e0b" },
                        ].map(stat => (
                            <div key={stat.label}>
                                <p style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>
                                    {stat.value}
                                </p>
                                <p style={{ fontSize: 12, color: "#475569" }}>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
                    <button onClick={handleRetry}
                        style={{
                            flex: 1, padding: "14px", borderRadius: 12,
                            backgroundColor: "#6366f1", color: "white",
                            fontWeight: 600, border: "none", cursor: "pointer", fontSize: 14,
                            boxShadow: "0 4px 16px rgba(99,102,241,0.3)"
                        }}>
                        Practice Again
                    </button>
                    <button onClick={handleDashboard}
                        style={{
                            flex: 1, padding: "14px", borderRadius: 12,
                            backgroundColor: "transparent", color: "#94a3b8",
                            fontWeight: 600, border: "1px solid #334155",
                            cursor: "pointer", fontSize: 14
                        }}>
                        Go to Dashboard
                    </button>
                </div>

                {/* Answer review */}
                <div>
                    <h2 style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                        Answer Review
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {results.map((r, i) => {
                            const options = r.options || [];
                            return (
                                <div key={i} style={{
                                    backgroundColor: "#1e293b",
                                    border: `1px solid ${r.isCorrect ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                                    borderRadius: 16, padding: "24px",
                                    borderLeft: `4px solid ${r.isCorrect ? "#22c55e" : r.selectedOption === null ? "#f59e0b" : "#ef4444"}`
                                }}>
                                    {/* Question header */}
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                                            backgroundColor: r.isCorrect ? "rgba(34,197,94,0.1)" 
    : r.selectedOption === null ? "rgba(245,158,11,0.1)" 
    : "rgba(239,68,68,0.1)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 14
                                        }}>
                                            {r.isCorrect ? "✓" : r.selectedOption === null ? "—" : "✗"}
                                        </div>
                                        <p style={{ color: "#f1f5f9", fontSize: 14, lineHeight: 1.6 }}>
                                            <span style={{ color: "#475569", fontSize: 12, marginRight: 8 }}>
                                                Q{i + 1}.
                                            </span>
                                            {r.questionText}
                                        </p>
                                    </div>

                                    {/* Options */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                                        {options.map((opt, j) => {
                                            const letter = ["A", "B", "C", "D"][j];
                                            const isCorrect = letter === r.correctOption;
                                            const isSelected = letter === r.selectedOption;
                                            const isWrongSelected = isSelected && !isCorrect;

                                            let bgColor = "#0f172a";
                                            let borderColor = "#334155";
                                            let textColor = "#64748b";

                                            if (isCorrect) {
                                                bgColor = "rgba(34,197,94,0.08)";
                                                borderColor = "rgba(34,197,94,0.3)";
                                                textColor = "#86efac";
                                            }
                                            if (isWrongSelected) {
                                                bgColor = "rgba(239,68,68,0.08)";
                                                borderColor = "rgba(239,68,68,0.3)";
                                                textColor = "#fca5a5";
                                            }

                                            return (
                                                <div key={j} style={{
                                                    display: "flex", alignItems: "center", gap: 12,
                                                    padding: "10px 14px", borderRadius: 10,
                                                    backgroundColor: bgColor,
                                                    border: `1px solid ${borderColor}`,
                                                }}>
                                                    <span style={{
                                                        width: 24, height: 24, borderRadius: 6,
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        fontSize: 11, fontWeight: 700,
                                                        backgroundColor: isCorrect ? "rgba(34,197,94,0.2)"
                                                            : isWrongSelected ? "rgba(239,68,68,0.2)"
                                                            : "#1e293b",
                                                        color: textColor, flexShrink: 0
                                                    }}>
                                                        {letter}
                                                    </span>
                                                    <span style={{ fontSize: 13, color: textColor }}>
                                                        {opt}
                                                    </span>
                                                    {isCorrect && (
                                                        <span style={{ marginLeft: "auto", fontSize: 11,
                                                            color: "#22c55e" }}>✓ Correct</span>
                                                    )}
                                                    {isWrongSelected && (
                                                        <span style={{ marginLeft: "auto", fontSize: 11,
                                                            color: "#ef4444" }}>✗ Your answer</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Explanation */}
                                    {r.explanation && (
                                        <div style={{
                                            backgroundColor: "rgba(99,102,241,0.05)",
                                            border: "1px solid rgba(99,102,241,0.15)",
                                            borderRadius: 10, padding: "12px 16px"
                                        }}>
                                            <p style={{ fontSize: 11, color: "#6366f1",
                                                fontWeight: 600, marginBottom: 4 }}>
                                                💡 EXPLANATION
                                            </p>
                                            <p style={{ fontSize: 20, color: "#94a3b8", lineHeight: 2 }}>
                                                {r.explanation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;
