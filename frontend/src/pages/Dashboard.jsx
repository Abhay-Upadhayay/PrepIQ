import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStats } from "../store/slices/analyticsSlice";
import { logout } from "../store/slices/authSlice";
import ActivityHeatmap from "../components/common/ActivityHeatmap";
import Loader from "../components/common/Loader";
import {
    BarChart, Bar, XAxis, YAxis,
    Tooltip, ResponsiveContainer, Cell
} from "recharts";

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { stats, weakAreas, subjectWise, recentSessions, loading } =
        useSelector(state => state.analytics);

    useEffect(() => { dispatch(fetchStats()); }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const getAccuracyColor = (acc) => {
        if (acc >= 75) return "#22c55e";
        if (acc >= 50) return "#f59e0b";
        return "#ef4444";
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload?.length) return (
            <div style={{
                backgroundColor: "#0f172a", border: "1px solid #334155",
                borderRadius: 10, padding: "10px 14px"
            }}>
                <p style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 600 }}>{label}</p>
                <p style={{ color: "#6366f1", fontSize: 13 }}>
                    Accuracy: {payload[0].value}%
                </p>
            </div>
        );
        return null;
    };

    if (loading) return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0a0f1a" }}
            className="flex items-center justify-center">
            <Loader size="lg" />
        </div>
    );

    const easy = subjectWise.filter(s => s.accuracyPercent >= 75);
    const medium = subjectWise.filter(s => s.accuracyPercent >= 50 && s.accuracyPercent < 75);
    const hard = subjectWise.filter(s => s.accuracyPercent < 50);

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0a0f1a", display: "flex", flexDirection: "column" }}>

            {/* Navbar */}
            <nav style={{
                backgroundColor: "#0d1117",
                borderBottom: "1px solid #1e293b",
                padding: "12px 32px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                position: "sticky", top: 0, zIndex: 50, flexShrink: 0
            }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#6366f1" }}>PrepIQ</span>
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
                                color: "#64748b", fontSize: 14,
                                cursor: "pointer", fontWeight: 500,
                                padding: "6px 14px", borderRadius: 8
                            }}>
                            {item.label}
                        </button>
                    ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        backgroundColor: "rgba(99,102,241,0.2)",
                        border: "1px solid rgba(99,102,241,0.4)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#a5b4fc", fontWeight: 700, fontSize: 13
                    }}>
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <button onClick={handleLogout} style={{
                        background: "none", border: "1px solid #1e293b",
                        color: "#64748b", fontSize: 12, cursor: "pointer",
                        padding: "5px 12px", borderRadius: 8
                    }}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main layout — left sidebar + right content */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

                {/* ── Left Sidebar ── */}
                <div style={{
                    width: 280, flexShrink: 0,
                    borderRight: "1px solid #1e293b",
                    backgroundColor: "#0d1117",
                    padding: "28px 20px",
                    display: "flex", flexDirection: "column", gap: 20,
                    overflowY: "auto"
                }}>
                    {/* Avatar + name */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingBottom: 20, borderBottom: "1px solid #1e293b" }}>
                        <div style={{
                            width: 72, height: 72, borderRadius: "50%",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 28, fontWeight: 800, color: "white"
                        }}>
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <p style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>{user?.name}</p>
                            <p style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>@{user?.email?.split("@")[0]}</p>
                        </div>
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            backgroundColor: "rgba(99,102,241,0.1)",
                            border: "1px solid rgba(99,102,241,0.2)",
                            borderRadius: 100, padding: "4px 12px",
                            fontSize: 12, color: "#a5b4fc"
                        }}>
                            🎯 {user?.targetExam}
                        </div>
                    </div>

                    {/* Solved ring — like LeetCode */}
                    <div style={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: 14, padding: "20px 16px"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            {/* Circle */}
                            <div style={{ position: "relative", flexShrink: 0 }}>
                                <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
                                    <circle cx="40" cy="40" r="32" fill="none" stroke="#334155" strokeWidth="6" />
                                    <circle cx="40" cy="40" r="32" fill="none"
                                        stroke="#6366f1" strokeWidth="6"
                                        strokeDasharray={`${2 * Math.PI * 32}`}
                                        strokeDashoffset={`${2 * Math.PI * 32 * (1 - (stats?.averagePercentage || 0) / 100)}`}
                                        strokeLinecap="round"
                                        style={{ transition: "stroke-dashoffset 1s ease" }}
                                    />
                                </svg>
                                <div style={{
                                    position: "absolute", inset: 0,
                                    display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center"
                                }}>
                                    <span style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>
                                        {stats?.totalQuestions || 0}
                                    </span>
                                    <span style={{ fontSize: 9, color: "#475569" }}>Done</span>
                                </div>
                            </div>

                            {/* Difficulty breakdown */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                                {[
                                    { label: "Strong", count: easy.length, total: subjectWise.length, color: "#22c55e" },
                                    { label: "Average", count: medium.length, total: subjectWise.length, color: "#f59e0b" },
                                    { label: "Weak", count: hard.length, total: subjectWise.length, color: "#ef4444" },
                                ].map(d => (
                                    <div key={d.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{
                                            fontSize: 11, color: d.color,
                                            backgroundColor: `${d.color}18`,
                                            padding: "2px 8px", borderRadius: 4
                                        }}>
                                            {d.label}
                                        </span>
                                        <span style={{ fontSize: 12, color: "#64748b" }}>
                                            {d.count}/{d.total || 0}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: 14, padding: "16px"
                    }}>
                        <p style={{ fontSize: 12, color: "#475569", fontWeight: 600,
                            textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>
                            Stats
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {[
                                { label: "Total Sessions", value: stats?.totalSessions || 0 },
                                { label: "Avg Accuracy", value: `${stats?.averagePercentage || 0}%` },
                                { label: "Best Score", value: `${stats?.bestPercentage || 0}%` },
                                { label: "Questions Done", value: stats?.totalQuestions || 0 },
                            ].map(s => (
                                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 13, color: "#64748b" }}>{s.label}</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Subjects */}
                    <div style={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: 14, padding: "16px"
                    }}>
                        <p style={{ fontSize: 12, color: "#475569", fontWeight: 600,
                            textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>
                            Subjects
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {(user?.selectedSubjects || []).map((sub, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{
                                        width: 6, height: 6, borderRadius: "50%",
                                        backgroundColor: "#6366f1"
                                    }} />
                                    <span style={{ fontSize: 13, color: "#94a3b8" }}>{sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Start practice button */}
                    <button onClick={() => navigate("/exam/setup")} style={{
                        width: "100%", padding: "12px",
                        backgroundColor: "#6366f1", color: "white",
                        border: "none", borderRadius: 10,
                        fontWeight: 600, fontSize: 14, cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(99,102,241,0.3)"
                    }}>
                        Start Practice →
                    </button>
                </div>

                {/* ── Right Content ── */}
                <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px" }}>

                    {/* Top row — chart + weak areas */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

                        {/* Subject accuracy chart */}
                        <div style={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: 16, padding: "20px 24px"
                        }}>
                            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 20 }}>
                                Subject-wise Accuracy
                            </h2>
                            {subjectWise.length === 0 ? (
                                <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <p style={{ color: "#475569", fontSize: 13 }}>Attempt exams to see stats</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={180}>
                                    <BarChart data={subjectWise} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <XAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 10 }}
                                            tickLine={false} axisLine={false} />
                                        <YAxis tick={{ fill: "#475569", fontSize: 10 }}
                                            tickLine={false} axisLine={false} domain={[0, 100]} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="accuracyPercent" radius={[6, 6, 0, 0]}>
                                            {subjectWise.map((entry, i) => (
                                                <Cell key={i} fill={getAccuracyColor(entry.accuracyPercent)} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Weak areas */}
                        <div style={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: 16, padding: "20px 24px"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>Weak Areas</h2>
                                <button onClick={() => navigate("/weak-areas")}
                                    style={{ background: "none", border: "none", color: "#6366f1", fontSize: 12, cursor: "pointer" }}>
                                    View all →
                                </button>
                            </div>
                            {weakAreas.length === 0 ? (
                                <div style={{ height: 180, display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center", gap: 8 }}>
                                    <span style={{ fontSize: 28 }}>🎯</span>
                                    <p style={{ color: "#475569", fontSize: 13 }}>No weak areas yet</p>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 180, overflowY: "auto" }}>
                                    {weakAreas.slice(0, 4).map((area, i) => (
                                        <div key={i} style={{
                                            display: "flex", alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "8px 12px", borderRadius: 8,
                                            backgroundColor: "#0f172a",
                                            border: "1px solid #334155"
                                        }}>
                                            <div>
                                                <p style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9" }}>{area.topic}</p>
                                                <p style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>
                                                    {area.subject} · {area.totalAttempts} attempts
                                                </p>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <p style={{ fontSize: 14, fontWeight: 700, color: getAccuracyColor(area.accuracyPercent) }}>
                                                    {area.accuracyPercent}%
                                                </p>
                                                <div style={{ width: 50, height: 3, backgroundColor: "#1e293b", borderRadius: 2, marginTop: 3 }}>
                                                    <div style={{
                                                        width: `${area.accuracyPercent}%`, height: "100%",
                                                        backgroundColor: getAccuracyColor(area.accuracyPercent),
                                                        borderRadius: 2
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Heatmap */}
                    <div style={{ marginBottom: 20 }}>
                        <ActivityHeatmap />
                    </div>

                    {/* Recent sessions */}
                    <div style={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: 16, padding: "20px 24px"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>Recent Sessions</h2>
                            <button onClick={() => navigate("/history")}
                                style={{ background: "none", border: "none", color: "#6366f1", fontSize: 12, cursor: "pointer" }}>
                                View all →
                            </button>
                        </div>

                        {recentSessions.length === 0 ? (
                            <p style={{ color: "#475569", fontSize: 13, textAlign: "center", padding: "24px 0" }}>
                                No sessions yet
                            </p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {/* Header */}
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 100px 80px 80px 80px 100px",
                                    padding: "0 12px", marginBottom: 4
                                }}>
                                    {["Subject", "Type", "Score", "Time", "Q's", "Date"].map(h => (
                                        <span key={h} style={{
                                            fontSize: 10, color: "#475569",
                                            textTransform: "uppercase", letterSpacing: "0.05em"
                                        }}>{h}</span>
                                    ))}
                                </div>

                                {recentSessions.map((s, i) => (
                                    <div key={i} style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 100px 80px 80px 80px 100px",
                                        padding: "10px 12px",
                                        backgroundColor: "#0f172a",
                                        borderRadius: 10,
                                        border: "1px solid #1e293b",
                                        alignItems: "center"
                                    }}>
                                        <span style={{ fontSize: 13, color: "#f1f5f9", fontWeight: 500 }}>
                                            {s.subject || "Mixed"}
                                        </span>
                                        <span style={{
                                            fontSize: 10, color: "#a5b4fc",
                                            backgroundColor: "rgba(99,102,241,0.1)",
                                            border: "1px solid rgba(99,102,241,0.15)",
                                            padding: "2px 8px", borderRadius: 100,
                                            width: "fit-content", textTransform: "capitalize"
                                        }}>
                                            {s.type}
                                        </span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: getAccuracyColor(s.percentage) }}>
                                            {s.percentage}%
                                        </span>
                                        <span style={{ fontSize: 12, color: "#475569" }}>
                                            {s.timeTaken ? `${Math.floor(s.timeTaken / 60)}m ${s.timeTaken % 60}s` : "—"}
                                        </span>
                                        <span style={{ fontSize: 12, color: "#475569" }}>
                                            {s.score}/{s.total}
                                        </span>
                                        <span style={{ fontSize: 11, color: "#475569" }}>
                                            {new Date(s.date).toLocaleDateString("en-IN", {
                                                day: "numeric", month: "short"
                                            })}
                                        </span>
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

export default Dashboard;