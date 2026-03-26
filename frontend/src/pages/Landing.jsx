import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Reusable scroll animation component
const FadeInSection = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (ref.current) observer.unobserve(ref.current);
                }
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
            }}
        >
            {children}
        </div>
    );
};

// --- SVG Icons ---
const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

const LineChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
    </svg>
);

const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3L22 4" />
    </svg>
);

const Landing = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
            {/* Header / Navbar */}
            <header className="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-[#334155]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
                            PrepIQ
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/login" 
                            className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2"
                        >
                            Log inward
                        </Link>
                        <Link 
                            to="/register" 
                            className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">
                {/* Background Image & Overlay */}
                <div 
                    className="absolute inset-0 z-0"
                    style={{ transform: `translateY(${scrollY * 0.4}px)` }}
                >
                    <img 
                        src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop" 
                        alt="Hero background" 
                        className="w-full h-full object-cover object-center opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/80 via-[#0f172a]/95 to-[#0f172a]"></div>
                </div>

                <div 
                    className="relative z-10 max-w-7xl mx-auto px-6 text-center"
                    style={{
                        opacity: Math.max(1 - scrollY / 600, 0),
                        transform: `translateY(${scrollY * 0.15}px)`
                    }}
                >
                    
                    
                    <FadeInSection delay={150}>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
                            Master your exams with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">Intelligent Practice</span>
                        </h1>
                    </FadeInSection>

                    <FadeInSection delay={300}>
                        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Stop guessing the right study path. PrepIQ analyzes your weak areas and generates personalized mock tests to systematically boost your scores.
                        </p>
                    </FadeInSection>

                    <FadeInSection delay={450}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link 
                                to="/register" 
                                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:-translate-y-1"
                            >
                                Start Practicing Free
                            </Link>
                            <Link 
                                to="/login" 
                                className="w-full sm:w-auto px-8 py-4 bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-white rounded-xl font-bold text-lg transition-all hover:-translate-y-1"
                            >
                                View Dashboard
                            </Link>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-[#0a0f1a] border-t border-[#1e293b]">
                <div className="max-w-7xl mx-auto px-6">
                    <FadeInSection>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Explore PrepIQ Features</h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                We combine smart algorithms with focused practice to ensure continuous improvement in crucial areas.
                            </p>
                        </div>
                    </FadeInSection>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <FadeInSection delay={100}>
                            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 h-full transition-transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                                <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                                    <TargetIcon />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Targeted Practice</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Generate custom tests focusing exactly on the topics and difficulty levels you need to master.
                                </p>
                            </div>
                        </FadeInSection>

                        {/* Feature 2 */}
                        <FadeInSection delay={200}>
                            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 h-full transition-transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20">
                                    <LineChartIcon />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Deep Analytics</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Visualize your progress over time with comprehensive heatmaps and subject-wise accuracy charts.
                                </p>
                            </div>
                        </FadeInSection>

                        {/* Feature 3 */}
                        <FadeInSection delay={300}>
                            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 h-full transition-transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                                <div className="w-14 h-14 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center mb-6 border border-purple-500/20">
                                    <BrainIcon />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Smart Weak Areas</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Our system automatically identifies your weakest topics and helps you turn them into your strengths.
                                </p>
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-[#0f172a]">
                <div className="max-w-7xl mx-auto px-6">
                    <FadeInSection>
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Path to Success</h2>
                            <p className="text-slate-400 text-lg">Three simple steps to exam success</p>
                        </div>
                    </FadeInSection>

                    <div className="max-w-4xl mx-auto">
                        {[
                            { step: "01", title: "Set Your Goals", desc: "Select your target exam and subjects to personalize your learning path." },
                            { step: "02", title: "Take Smart Tests", desc: "Practice with timed, adaptive quizzes focusing on various difficulty levels." },
                            { step: "03", title: "Track & Improve", desc: "Review detailed solutions, analyze your mistakes, and watch your accuracy grow." }
                        ].map((item, i) => (
                            <FadeInSection key={i} delay={i * 150}>
                                <div className="flex gap-6 md:gap-8 mb-12 last:mb-0">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1e293b] border-2 border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xl md:text-2xl shrink-0 z-10">
                                            {item.step}
                                        </div>
                                        {i !== 2 && (
                                            <div className="w-0.5 h-full bg-gradient-to-b from-indigo-500/30 to-transparent mt-4 min-h-[60px]"></div>
                                        )}
                                    </div>
                                    <div className="pt-2 md:pt-4 pb-8">
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{item.title}</h3>
                                        <p className="text-slate-400 text-base md:text-lg leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-900/20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <FadeInSection>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to ace your next exam?</h2>
                        <p className="text-xl text-slate-300 mb-10">
                            Join thousands of students already learning smarter with PrepIQ.
                        </p>
                        <Link 
                            to="/register" 
                            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:-translate-y-1"
                        >
                            Create Your Free Account
                            <CheckCircleIcon />
                        </Link>
                    </FadeInSection>
                </div>
            </section>

            {/* Minimal Footer */}
            <footer className="border-t border-[#1e293b] bg-[#0a0f1a] py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-indigo-500">PrepIQ</span>
                        <span className="text-slate-500 text-sm">© {new Date().getFullYear()} All rights reserved.</span>
                    </div>
                    <div className="flex gap-6 text-sm text-slate-400">
                        <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;