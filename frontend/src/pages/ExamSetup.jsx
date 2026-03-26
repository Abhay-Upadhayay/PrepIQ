import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { startExam } from "../store/slices/examSlice";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";

const EXAM_CONFIG = {
    GATE: {
        subjects: {
            "Data Structures": ["Arrays", "Linked Lists", "Stacks", "Queues", "Binary Trees", "Graphs", "Sorting", "Hashing"],
            "Algorithms": ["Searching", "Sorting", "Dynamic Programming", "Greedy", "Divide and Conquer", "Graph Algorithms"],
            "Operating Systems": ["Processes", "Threads", "Deadlocks", "Memory Management", "File Systems", "Scheduling"],
            "Computer Networks": ["OSI Model", "TCP/IP", "Routing", "DNS", "HTTP", "Security"],
            "DBMS": ["ER Model", "Normalization", "SQL", "Transactions", "Indexing", "Concurrency"],
        }
    },
    JEE: {
        subjects: {
            "Physics": ["Mechanics", "Thermodynamics", "Electrostatics", "Optics", "Modern Physics"],
            "Chemistry": ["Organic", "Inorganic", "Physical Chemistry", "Electrochemistry"],
            "Mathematics": ["Calculus", "Algebra", "Trigonometry", "Coordinate Geometry", "Probability"],
        }
    },
    UPSC: {
        subjects: {
            "History": ["Ancient India", "Medieval India", "Modern India", "World History"],
            "Geography": ["Physical Geography", "Indian Geography", "World Geography"],
            "Polity": ["Constitution", "Parliament", "Judiciary", "Federalism"],
            "Economy": ["Micro Economics", "Macro Economics", "Indian Economy"],
        }
    },
    CAT: {
        subjects: {
            "Quantitative Aptitude": ["Arithmetic", "Algebra", "Geometry", "Number Systems"],
            "Verbal Ability": ["Reading Comprehension", "Grammar", "Vocabulary"],
            "Logical Reasoning": ["Puzzles", "Syllogism", "Data Interpretation"],
        }
    }
};

const DIFFICULTIES = ["easy", "medium", "hard", "mixed"];
const QUESTION_COUNTS = [5, 10, 15, 20, 25, 30];

const ExamSetup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector(state => state.exam);
    const { user } = useSelector(state => state.auth);

    const [step, setStep] = useState(1); // 1 = subject, 2 = config
    const [config, setConfig] = useState({
        exam: user?.targetExam || "GATE",
        subject: "",
        topic: "",
        difficulty: "mixed",
        questionCount: 10,
        type: "practice"
    });

    const subjects = EXAM_CONFIG[config.exam]?.subjects || {};
    const topics = config.subject ? subjects[config.subject] || [] : [];

    const handleExamChange = (exam) => {
        setConfig(prev => ({ ...prev, exam, subject: "", topic: "" }));
    };

    const handleSubjectSelect = (subject) => {
        setConfig(prev => ({ ...prev, subject, topic: "" }));
        setStep(2);
    };

    const handleStart = async () => {
        
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith("submitted_")) localStorage.removeItem(key);
        });

        if (!config.subject) return toast.error("Please select a subject");

        const payload = {
            type: config.type,
            exam: config.exam,
            subject: config.subject,
            difficulty: config.difficulty === "mixed" ? undefined : config.difficulty,
            questionCount: config.questionCount,
        };
        if (config.topic) payload.topic = config.topic;

        const result = await dispatch(startExam(payload));

        if (startExam.fulfilled.match(result)) {
            navigate(`/exam/${result.payload.sessionId}`);
        } else {
            toast.error(result.payload || "Failed to start exam");
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0f172a" }} className="px-4 py-10">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-10">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 text-sm mb-6 hover:opacity-80 transition"
                        style={{ color: "#94a3b8" }}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-white">Start Practice</h1>
                    <p className="mt-1 text-sm" style={{ color: "#94a3b8" }}>
                        Configure your session and get started
                    </p>
                </div>

                {/* Step indicators */}
                <div className="flex items-center gap-3 mb-8">
                    {["Choose Subject", "Configure"].map((label, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                    style={{
                                        backgroundColor: step > i + 1 ? "#22c55e" : step === i + 1 ? "#6366f1" : "#1e293b",
                                        color: step >= i + 1 ? "white" : "#475569"
                                    }}
                                >
                                    {step > i + 1 ? "✓" : i + 1}
                                </div>
                                <span className="text-sm" style={{ color: step === i + 1 ? "#f1f5f9" : "#475569" }}>
                                    {label}
                                </span>
                            </div>
                            {i < 1 && <div className="w-8 h-px" style={{ backgroundColor: "#1e293b" }} />}
                        </div>
                    ))}
                </div>

                {/* Step 1 — Choose Subject */}
                {step === 1 && (
                    <div className="rounded-2xl p-8" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>

                        {/* Exam selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-3" style={{ color: "#94a3b8" }}>
                                Target Exam
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(EXAM_CONFIG).map(exam => (
                                    <button
                                        key={exam}
                                        onClick={() => handleExamChange(exam)}
                                        className="px-4 py-2 rounded-lg text-sm font-medium transition"
                                        style={{
                                            backgroundColor: config.exam === exam ? "#6366f1" : "#0f172a",
                                            color: config.exam === exam ? "white" : "#64748b",
                                            border: `1px solid ${config.exam === exam ? "#6366f1" : "#334155"}`
                                        }}
                                    >
                                        {exam}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subject cards */}
                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: "#94a3b8" }}>
                                Select Subject
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                                {Object.keys(subjects).map(subject => (
                                    <button
                                        key={subject}
                                        onClick={() => handleSubjectSelect(subject)}
                                        className="flex items-center justify-between p-4 rounded-xl text-left transition hover:opacity-90"
                                        style={{
                                            backgroundColor: "#0f172a",
                                            border: `1px solid ${config.subject === subject ? "#6366f1" : "#334155"}`,
                                        }}
                                    >
                                        <div>
                                            <p className="font-medium text-white text-sm">{subject}</p>
                                            <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                                                {subjects[subject].length} topics
                                            </p>
                                        </div>
                                        <svg className="w-4 h-4" style={{ color: "#475569" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2 — Configure */}
                {step === 2 && (
                    <div className="rounded-2xl p-8 space-y-6" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>

                        {/* Selected subject badge */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-1 rounded-full text-xs font-medium"
                                    style={{ backgroundColor: "rgba(99,102,241,0.15)", color: "#a5b4fc" }}>
                                    {config.exam}
                                </div>
                                <span className="text-white font-semibold">{config.subject}</span>
                            </div>
                            <button onClick={() => setStep(1)}
                                className="text-xs hover:underline" style={{ color: "#6366f1" }}>
                                Change
                            </button>
                        </div>

                        {/* Session type */}
                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: "#94a3b8" }}>
                                Session Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: "practice", label: "Practice", desc: "Topic focused, no pressure" },
                                    { value: "mock", label: "Mock Test", desc: "Full timed exam simulation" }
                                ].map(t => (
                                    <button
                                        key={t.value}
                                        onClick={() => setConfig(prev => ({ ...prev, type: t.value }))}
                                        className="p-4 rounded-xl text-left transition"
                                        style={{
                                            backgroundColor: config.type === t.value ? "rgba(99,102,241,0.1)" : "#0f172a",
                                            border: `1px solid ${config.type === t.value ? "#6366f1" : "#334155"}`,
                                        }}
                                    >
                                        <p className="text-sm font-medium text-white">{t.label}</p>
                                        <p className="text-xs mt-1" style={{ color: "#475569" }}>{t.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Topic (optional) */}
                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: "#94a3b8" }}>
                                Topic <span style={{ color: "#475569" }}>(optional — leave blank for all topics)</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setConfig(prev => ({ ...prev, topic: "" }))}
                                    className="px-3 py-1.5 rounded-full text-xs transition"
                                    style={{
                                        backgroundColor: !config.topic ? "#6366f1" : "#0f172a",
                                        color: !config.topic ? "white" : "#64748b",
                                        border: `1px solid ${!config.topic ? "#6366f1" : "#334155"}`
                                    }}
                                >
                                    All Topics
                                </button>
                                {topics.map(topic => (
                                    <button
                                        key={topic}
                                        onClick={() => setConfig(prev => ({ ...prev, topic }))}
                                        className="px-3 py-1.5 rounded-full text-xs transition"
                                        style={{
                                            backgroundColor: config.topic === topic ? "#6366f1" : "#0f172a",
                                            color: config.topic === topic ? "white" : "#64748b",
                                            border: `1px solid ${config.topic === topic ? "#6366f1" : "#334155"}`
                                        }}
                                    >
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty */}
                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: "#94a3b8" }}>
                                Difficulty
                            </label>
                            <div className="flex gap-2">
                                {DIFFICULTIES.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setConfig(prev => ({ ...prev, difficulty: d }))}
                                        className="flex-1 py-2 rounded-lg text-xs font-medium capitalize transition"
                                        style={{
                                            backgroundColor: config.difficulty === d ? "#6366f1" : "#0f172a",
                                            color: config.difficulty === d ? "white" : "#64748b",
                                            border: `1px solid ${config.difficulty === d ? "#6366f1" : "#334155"}`
                                        }}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question count */}
                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: "#94a3b8" }}>
                                Number of Questions
                            </label>
                            <div className="flex gap-2">
                                {QUESTION_COUNTS.map(count => (
                                    <button
                                        key={count}
                                        onClick={() => setConfig(prev => ({ ...prev, questionCount: count }))}
                                        className="flex-1 py-2 rounded-lg text-sm font-medium transition"
                                        style={{
                                            backgroundColor: config.questionCount === count ? "#6366f1" : "#0f172a",
                                            color: config.questionCount === count ? "white" : "#64748b",
                                            border: `1px solid ${config.questionCount === count ? "#6366f1" : "#334155"}`
                                        }}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="rounded-xl p-4" style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }}>
                            <p className="text-xs font-medium mb-2" style={{ color: "#475569" }}>SESSION SUMMARY</p>
                            <div className="flex flex-wrap gap-x-6 gap-y-1">
                                {[
                                    { label: "Exam", value: config.exam },
                                    { label: "Subject", value: config.subject },
                                    { label: "Topic", value: config.topic || "All Topics" },
                                    { label: "Difficulty", value: config.difficulty },
                                    { label: "Questions", value: config.questionCount },
                                    { label: "Time", value: `${config.questionCount * 2} min` },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center gap-1.5">
                                        <span className="text-xs" style={{ color: "#475569" }}>{item.label}:</span>
                                        <span className="text-xs font-medium text-white capitalize">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Start button */}
                        <button
                            onClick={handleStart}
                            disabled={loading}
                            className="w-full py-4 rounded-xl font-semibold text-white transition disabled:opacity-50"
                            style={{ backgroundColor: "#6366f1", boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
                        >
                            {loading ? <Loader size="sm" /> : `Start ${config.type === "mock" ? "Mock Test" : "Practice"} →`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamSetup;