import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector(state => state.auth);

    const [form, setForm] = useState({ email: "", password: "" });

    // If already logged in, redirect
    useEffect(() => {
        if (token) navigate("/dashboard");
    }, [token]);

    // Show error toast
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            return toast.error("All fields are required");
        }
        dispatch(loginUser(form));
    };

    return (
    <div
        className="flex items-center justify-center px-4 bg-dark min-h-screen">
        <div className="w-full max-w-md">

            {/* Logo */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary">PrepIQ</h1>
                <p className="mt-2 text-sm text-muted">Welcome back. Let's get to work.</p>
            </div>

            {/* Card */}
            <div className="rounded-2xl p-8 bg-card border border-border">
                <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm mb-1.5" style={{ color: "#94a3b8" }}>Email</label>
                        <input
                            type="email" name="email" value={form.email}
                            onChange={handleChange} placeholder="you@example.com"
                            style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "white" }}
                            className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none placeholder:text-slate-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1.5" style={{ color: "#94a3b8" }}>Password</label>
                        <input
                            type="password" name="password" value={form.password}
                            onChange={handleChange} placeholder="••••••••"
                            style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "white" }}
                            className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none"
                        />
                    </div>

                    <button type="submit" disabled={loading}
                        style={{ backgroundColor: "#6366f1" }}
                        className="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center">
                        {loading ? <Loader size="sm" /> : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-sm mt-6" style={{ color: "#94a3b8" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "#6366f1" }} className="hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    </div>
);
};

export default Login;