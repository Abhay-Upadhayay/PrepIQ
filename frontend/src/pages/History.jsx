import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/common/Loader";

const History = () => {
    const navigate = useNavigate();
    
    const [historySessions, setHistorySessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get("/attempts/my");
                const formatted = res.data.sessions.map(s => ({
                    _id: s._id,
                    type: s.type,
                    subject: s.subject,
                    score: s.score,
                    total: s.questions.length,
                    percentage: Math.round((s.score / s.questions.length) * 100) || 0,
                    timeTaken: s.endTime 
                        ? Math.round((new Date(s.endTime) - new Date(s.startTime)) / 1000)
                        : null,
                    date: s.endTime || s.createdAt
                }));
                setHistorySessions(formatted);
            } catch (error) {
                console.error("Failed to load history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getAccuracyColor = (acc) => {
        if (acc >= 75) return "#22c55e";
        if (acc >= 50) return "#f59e0b";
        return "#ef4444";
    };

    const getGrade = (pct) => {
        if (pct >= 90) return { label: "Excellent", color: "#22c55e" };
        if (pct >= 75) return { label: "Great", color: "#6366f1" };
        if (pct >= 50) return { label: "Good", color: "#f59e0b" };
        return { label: "Poor", color: "#ef4444" };
    };

    const filtered = historySessions
        .filter(s => filter === "all" || s.type === filter)
        .sort((a, b) => {
            if (sortBy === "date") return new Date(b.date) - new Date(a.date);
            if (sortBy === "score") return b.percentage - a.percentage;
            if (sortBy === "worst") return a.percentage - b.percentage;
            return 0;
        });

    // Summary stats from sessions
    const totalSessions = historySessions.length;
    const avgScore = totalSessions
        ? Math.round(historySessions.reduce((a, b) => a + b.percentage, 0) / totalSessions)
        : 0;
    const bestScore = totalSessions
        ? Math.max(...historySessions.map(s => s.percentage))
        : 0;
    const totalQuestions = historySessions.reduce((a, b) => a + b.total, 0);

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
                                color: item.path === "/history" ? "#a5b4fc" : "#64748b",
                                fontSize: 14, cursor: "pointer",
                                fontWeight: item.path === "/history" ? 600 : 500,
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

            <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9" }}>
                        Session History
                    </h1>
                    <p style={{ fontSize: 14, color: "#475569", marginTop: 4 }}>
                        All your past practice sessions and mock tests
                    </p>
                </div>

                {/* Summary cards */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 14, marginBottom: 24
                }}>
                    {[
                        { label: "Total Sessions", value: totalSessions, icon: "📚", color: "#6366f1" },
                        { label: "Avg Score", value: `${avgScore}%`, icon: "📊", color: "#22c55e" },
                        { label: "Best Score", value: `${bestScore}%`, icon: "🏆", color: "#f59e0b" },
                        { label: "Questions Done", value: totalQuestions, icon: "✅", color: "#3b82f6" },
                    ].map((card, i) => (
                        <div key={i} style={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: 14, padding: "18px 20px",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                <span style={{ fontSize: 20 }}>{card.icon}</span>
                                <div style={{
                                    width: 7, height: 7, borderRadius: "50%",
                                    backgroundColor: card.color,
                                    boxShadow: `0 0 6px ${card.color}`
                                }} />
                            </div>
                            <p style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9" }}>
                                {card.value}
                            </p>
                            <p style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>
                                {card.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Filters + Sort */}
                <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", marginBottom: 16
                }}>
                    {/* Type filter */}
                    <div style={{ display: "flex", gap: 8 }}>
                        {["all", "practice", "mock"].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                style={{
                                    padding: "7px 16px", borderRadius: 8,
                                    fontSize: 13, fontWeight: 500,
                                    cursor: "pointer", textTransform: "capitalize",
                                    backgroundColor: filter === f ? "#6366f1" : "#1e293b",
                                    color: filter === f ? "white" : "#64748b",
                                    border: `1px solid ${filter === f ? "#6366f1" : "#334155"}`,
                                    transition: "all 0.15s"
                                }}>
                                {f === "all" ? "All" : f === "practice" ? "Practice" : "Mock Test"}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "#475569" }}>Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            style={{
                                backgroundColor: "#1e293b",
                                border: "1px solid #334155",
                                color: "#f1f5f9", fontSize: 13,
                                padding: "6px 12px", borderRadius: 8,
                                cursor: "pointer", outline: "none"
                            }}
                        >
                            <option value="date">Latest First</option>
                            <option value="score">Best Score</option>
                            <option value="worst">Worst Score</option>
                        </select>
                    </div>
                </div>

                {/* Sessions list */}
                {filtered.length === 0 ? (
                    <div style={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: 16, padding: "60px 24px",
                        textAlign: "center"
                    }}>
                        <span style={{ fontSize: 36 }}>📭</span>
                        <p style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 600, marginTop: 16 }}>
                            No sessions found
                        </p>
                        <p style={{ color: "#475569", fontSize: 13, marginTop: 6 }}>
                            {filter !== "all"
                                ? `No ${filter} sessions yet`
                                : "Start practicing to see your history"
                            }
                        </p>
                        <button onClick={() => navigate("/exam/setup")}
                            style={{
                                marginTop: 16, padding: "10px 24px",
                                backgroundColor: "#6366f1", color: "white",
                                border: "none", borderRadius: 8,
                                fontWeight: 600, fontSize: 13, cursor: "pointer"
                            }}>
                            Start Practice
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {/* Table header */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 110px 90px 90px 90px 110px 90px",
                            padding: "8px 16px"
                        }}>
                            {["Subject", "Type", "Score", "Correct", "Time", "Date", "Grade"].map(h => (
                                <span key={h} style={{
                                    fontSize: 10, color: "#475569",
                                    textTransform: "uppercase", letterSpacing: "0.06em"
                                }}>
                                    {h}
                                </span>
                            ))}
                        </div>

                        {filtered.map((s, i) => {
                            const grade = getGrade(s.percentage);
                            return (
                                <div key={i} style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 110px 90px 90px 90px 110px 90px",
                                    padding: "14px 16px",
                                    backgroundColor: "#1e293b",
                                    borderRadius: 12,
                                    border: "1px solid #334155",
                                    alignItems: "center",
                                    transition: "border-color 0.15s"
                                }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = "#475569"}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = "#334155"}
                                >
                                    {/* Subject */}
                                    <div>
                                        <p style={{ fontSize: 13, color: "#f1f5f9", fontWeight: 600 }}>
                                            {s.subject || "Mixed"}
                                        </p>
                                        <p style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                                            {s.total} questions
                                        </p>
                                    </div>

                                    {/* Type */}
                                    <span style={{
                                        fontSize: 11, color: "#a5b4fc",
                                        backgroundColor: "rgba(99,102,241,0.1)",
                                        border: "1px solid rgba(99,102,241,0.15)",
                                        padding: "3px 10px", borderRadius: 100,
                                        width: "fit-content", textTransform: "capitalize"
                                    }}>
                                        {s.type}
                                    </span>

                                    {/* Score % */}
                                    <span style={{
                                        fontSize: 15, fontWeight: 700,
                                        color: getAccuracyColor(s.percentage)
                                    }}>
                                        {s.percentage}%
                                    </span>

                                    {/* Correct/Total */}
                                    <span style={{ fontSize: 13, color: "#64748b" }}>
                                        {s.score}/{s.total}
                                    </span>

                                    {/* Time taken */}
                                    <span style={{ fontSize: 12, color: "#475569" }}>
                                        {s.timeTaken
                                            ? `${Math.floor(s.timeTaken / 60)}m ${s.timeTaken % 60}s`
                                            : "—"}
                                    </span>

                                    {/* Date */}
                                    <span style={{ fontSize: 12, color: "#475569" }}>
                                        {new Date(s.date).toLocaleDateString("en-IN", {
                                            day: "numeric", month: "short", year: "numeric"
                                        })}
                                    </span>

                                    {/* Grade badge */}
                                    <span style={{
                                        fontSize: 11, fontWeight: 600,
                                        color: grade.color,
                                        backgroundColor: `${grade.color}18`,
                                        padding: "3px 10px", borderRadius: 100,
                                        width: "fit-content"
                                    }}>
                                        {grade.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;