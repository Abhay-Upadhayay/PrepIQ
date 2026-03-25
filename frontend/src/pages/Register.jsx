import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";

const EXAMS = ["GATE", "JEE", "UPSC", "CAT", "NEET"];
const SUBJECTS = {
    GATE: ["Data Structures", "Algorithms", "Operating Systems", "Computer Networks", "DBMS"],
    JEE: ["Physics", "Chemistry", "Mathematics"],
    UPSC: ["History", "Geography", "Polity", "Economy"],
    CAT: ["Quantitative Aptitude", "Verbal Ability", "Logical Reasoning"],
    NEET: ["Physics", "Chemistry", "Biology"]
};

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector(state => state.auth);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        targetExam: "",
        selectedSubjects: []
    });

    useEffect(() => {
        if (token) navigate("/dashboard");
    }, [token]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Reset subjects when exam changes
        if (name === "targetExam") {
            setForm(prev => ({ ...prev, targetExam: value, selectedSubjects: [] }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const toggleSubject = (subject) => {
        setForm(prev => ({
            ...prev,
            selectedSubjects: prev.selectedSubjects.includes(subject)
                ? prev.selectedSubjects.filter(s => s !== subject)
                : [...prev.selectedSubjects, subject]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, password, targetExam, selectedSubjects } = form;

        if (!name || !email || !password || !targetExam) {
            return toast.error("All fields are required");
        }
        if (selectedSubjects.length === 0) {
            return toast.error("Select at least one subject");
        }
        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        dispatch(registerUser(form));
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">PrepIQ</h1>
                    <p className="text-muted mt-2">Start your smart exam prep today.</p>
                </div>

                {/* Card */}
                <div className="bg-card border border-border rounded-2xl p-8">
                    <h2 className="text-xl font-semibold text-white mb-6">Create Account</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Name */}
                        <div>
                            <label className="block text-sm text-muted mb-1.5">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Rahul Sharma"
                                className="w-full bg-dark border border-border rounded-lg px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-primary transition"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm text-muted mb-1.5">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full bg-dark border border-border rounded-lg px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-primary transition"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-muted mb-1.5">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Min. 8 characters"
                                className="w-full bg-dark border border-border rounded-lg px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-primary transition"
                            />
                        </div>

                        {/* Target Exam */}
                        <div>
                            <label className="block text-sm text-muted mb-1.5">Target Exam</label>
                            <select
                                name="targetExam"
                                value={form.targetExam}
                                onChange={handleChange}
                                className="w-full bg-dark border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                            >
                                <option value="">Select exam</option>
                                {EXAMS.map(e => (
                                    <option key={e} value={e}>{e}</option>
                                ))}
                            </select>
                        </div>

                        {/* Subjects — only show after exam selected */}
                        {form.targetExam && (
                            <div>
                                <label className="block text-sm text-muted mb-2">
                                    Select Subjects
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SUBJECTS[form.targetExam].map(subject => (
                                        <button
                                            type="button"
                                            key={subject}
                                            onClick={() => toggleSubject(subject)}
                                            className={`px-3 py-1.5 rounded-full text-sm border transition
                                                ${form.selectedSubjects.includes(subject)
                                                    ? "bg-primary border-primary text-white"
                                                    : "border-border text-muted hover:border-primary"
                                                }`}
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader size="sm" /> : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center text-muted text-sm mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;