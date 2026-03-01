import { useState, useEffect } from 'react';
import {
    Shield,
    Mail,
    Lock,
    Building,
    ChevronRight,
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Sparkles,
    Star,
    Quote,
    Award,
    Users,
    Clock,
    ShieldCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { US_STATES, VENUE_TYPES, EMPLOYEE_RANGES } from '../data/states';
import type { VenueType, EmployeeRange } from '../types';
import { Link } from 'react-router-dom';

type AuthView = 'signin' | 'signup' | 'forgot-password';

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [end, duration]);

    return <span>{count}{suffix}</span>;
}

// Testimonials Data
const TESTIMONIALS = [
    {
        quote: "We passed our health inspection with zero violations for the first time in 5 years. The AI checklist suggestions caught issues we didn't even know existed.",
        author: "Sarah Martinez",
        role: "General Manager",
        venue: "Bourbon Street Grill",
        rating: 5
    },
    {
        quote: "ComplianceDaddy paid for itself in the first month. No more fines, no more scrambling when the inspector shows up unexpectedly.",
        author: "Mike Thompson",
        role: "Owner",
        venue: "The Brass Rail",
        rating: 5
    },
    {
        quote: "The voice-to-checklist feature saves us 2 hours every day. My staff actually enjoys doing compliance now.",
        author: "Jennifer Liu",
        role: "Operations Director",
        venue: "Downtown Hospitality Group",
        rating: 5
    }
];

// Stats Data
const STATS = [
    { value: 500, suffix: '+', label: 'Venues Protected' },
    { value: 99, suffix: '%', label: 'Inspection Pass Rate' },
    { value: 50, suffix: 'K+', label: 'Compliance Tasks Completed' },
    { value: 2, suffix: 'M+', label: 'In Violations Prevented' }
];

export default function AuthPage() {
    const { signIn, signUp, signInWithGoogle, forgotPassword } = useAuth();
    const [view, setView] = useState<AuthView>('signin');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // Sign In State
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');

    // Forgot Password State
    const [resetEmail, setResetEmail] = useState('');

    // Sign Up State
    const [signUpForm, setSignUpForm] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        company: '',
        city: '',
        state: '',
        zipcode: '',
        venueType: 'bar' as VenueType,
        employeeRange: '1-10' as EmployeeRange,
    });

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signIn(signInEmail, signInPassword);
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // In AuthContext, auditState is derived from state code or look-up
            await signUp(signUpForm);
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Google sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            await forgotPassword(resetEmail);
            setMessage('Password reset link sent to your email.');
        } catch (err: any) {
            setError(err.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Left Side: Branding & Features */}
            <div className="auth-showcase">
                <div className="auth-showcase-content">
                    <div className="logo-section">
                        <div className="logo-icon bg-gold">
                            <Shield size={32} />
                        </div>
                        <h1 className="logo-text text-cream font-display">ComplianceDaddy</h1>
                    </div>

                    <div className="showcase-headlines">
                        <div className="ai-badge">
                            <Sparkles size={14} />
                            <span>AI-Powered Compliance</span>
                        </div>
                        <h2 className="title-lg text-cream">Stop Fearing The Inspector.</h2>
                        <p className="subtitle text-muted">
                            The only compliance platform that uses AI to predict violations before they happen.
                            Join 500+ venues that ace inspections with zero stress.
                        </p>
                    </div>

                    <div className="feature-grid">
                        <div className="feature-item">
                            <div className="feature-icon"><Sparkles size={20} /></div>
                            <div>
                                <h4 className="text-cream">AI Compliance Assistant</h4>
                                <p className="text-muted-sm">Voice-activated checklists with smart recommendations that predict violations before they happen.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><CheckCircle2 size={20} /></div>
                            <div>
                                <h4 className="text-cream">Smart Checklists</h4>
                                <p className="text-muted-sm">Pre-loaded health, fire, and alcohol templates customized for your venue type.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><CheckCircle2 size={20} /></div>
                            <div>
                                <h4 className="text-cream">Audit Trails</h4>
                                <p className="text-muted-sm">Time-stamped photo logs with GPS verification for 100% inspector accountability.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><CheckCircle2 size={20} /></div>
                            <div>
                                <h4 className="text-cream">Cert Vault</h4>
                                <p className="text-muted-sm">Auto-alerts 30, 60, 90 days before permits expire. Never miss a renewal deadline.</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="stats-section">
                        {STATS.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <div className="stat-value">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Testimonials Section */}
                    <div className="testimonials-section">
                        <h3 className="testimonials-title">Loved by Hospitality Pros</h3>
                        <div className="testimonials-grid">
                            {TESTIMONIALS.map((testimonial, index) => (
                                <div key={index} className="testimonial-card">
                                    <div className="testimonial-stars">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} size={14} className="star-filled" />
                                        ))}
                                    </div>
                                    <Quote size={20} className="testimonial-quote-icon" />
                                    <p className="testimonial-text">"{testimonial.quote}"</p>
                                    <div className="testimonial-author">
                                        <div className="testimonial-name">{testimonial.author}</div>
                                        <div className="testimonial-role">{testimonial.role}, {testimonial.venue}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="trust-badges">
                        <div className="trust-badge">
                            <ShieldCheck size={18} />
                            <span>SOC 2 Compliant</span>
                        </div>
                        <div className="trust-badge">
                            <Award size={18} />
                            <span>256-bit Encryption</span>
                        </div>
                        <div className="trust-badge">
                            <Users size={18} />
                            <span>HIPAA Ready</span>
                        </div>
                        <div className="trust-badge">
                            <Clock size={18} />
                            <span>99.9% Uptime</span>
                        </div>
                    </div>
                </div>

                <div className="auth-showcase-footer">
                    <p className="text-muted-sm">Join 500+ venues already using ComplianceDaddy to ace their inspections.</p>
                </div>
            </div>

            {/* Right Side: Auth Forms */}
            <div className="auth-form-section">
                <div className="auth-form-card card shadow-leather">
                    {view === 'signin' && (
                        <div className="animate-enter">
                            <h2 className="form-title text-cream">Welcome Back</h2>
                            <p className="form-subtitle text-muted">Log in to your venue dashboard</p>

                            <button
                                type="button"
                                className="btn btn-google w-full mt-6"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="google-icon" />
                                Continue with Google
                            </button>

                            <div className="divider">
                                <span>or use email</span>
                            </div>

                            <form onSubmit={handleSignIn} className="mt-4">
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <div className="input-with-icon">
                                        <Mail size={18} className="icon-left" />
                                        <input
                                            type="email"
                                            className="form-input text-cream"
                                            placeholder="wayne@compliance.com"
                                            value={signInEmail}
                                            onChange={(e) => setSignInEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="flex justify-between items-center">
                                        <label className="form-label">Password</label>
                                        <button
                                            type="button"
                                            className="text-link text-xs"
                                            onClick={() => setView('forgot-password')}
                                        >
                                            Forgot?
                                        </button>
                                    </div>
                                    <div className="input-with-icon">
                                        <Lock size={18} className="icon-left" />
                                        <input
                                            type="password"
                                            className="form-input text-cream"
                                            placeholder="••••••••"
                                            value={signInPassword}
                                            onChange={(e) => setSignInPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {error && <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>}

                                <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </form>

                            <p className="mt-8 text-center text-sm text-muted">
                                Don't have an account? {' '}
                                <button
                                    type="button"
                                    className="text-gold font-bold hover:underline"
                                    onClick={() => setView('signup')}
                                >
                                    Create one for free
                                </button>
                            </p>

                            <div className="demo-divider">
                                <span>or</span>
                            </div>

                            <Link to="/demo" className="btn btn-demo w-full">
                                <Sparkles size={18} /> Try Live Demo
                            </Link>
                            <p className="text-center text-xs text-muted mt-2">
                                No signup required • See AI in action
                            </p>
                        </div>
                    )}

                    {view === 'signup' && (
                        <div className="animate-enter-right">
                            <button
                                className="btn btn-ghost btn-xs mb-4 p-0 flex items-center gap-1"
                                onClick={() => setView('signin')}
                            >
                                <ArrowLeft size={14} /> Back to login
                            </button>
                            <h2 className="form-title text-cream">Start Your Free Trial</h2>
                            <p className="form-subtitle text-muted">Set up your venue in under 2 minutes</p>

                            <form onSubmit={handleSignUp} className="mt-6 grid-2 gap-4">
                                <div className="form-group col-span-1">
                                    <label className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        className="form-input text-cream"
                                        placeholder="Wayne"
                                        value={signUpForm.firstName}
                                        onChange={(e) => setSignUpForm({ ...signUpForm, firstName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group col-span-1">
                                    <label className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-input text-cream"
                                        placeholder="LeBlanc"
                                        value={signUpForm.lastName}
                                        onChange={(e) => setSignUpForm({ ...signUpForm, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group col-span-2">
                                    <label className="form-label">Company / Venue Name</label>
                                    <div className="input-with-icon">
                                        <Building size={16} className="icon-left" />
                                        <input
                                            type="text"
                                            className="form-input text-cream"
                                            placeholder="Brass Rail Bar & Grill"
                                            value={signUpForm.company}
                                            onChange={(e) => setSignUpForm({ ...signUpForm, company: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group col-span-2">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-input text-cream"
                                        placeholder="wayne@mybar.com"
                                        value={signUpForm.email}
                                        onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group col-span-2">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-input text-cream"
                                        placeholder="Min 8 characters"
                                        value={signUpForm.password}
                                        onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group col-span-1">
                                    <label className="form-label">City</label>
                                    <input
                                        type="text"
                                        className="form-input text-cream"
                                        placeholder="New Orleans"
                                        value={signUpForm.city}
                                        onChange={(e) => setSignUpForm({ ...signUpForm, city: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group col-span-1">
                                    <label className="form-label">State</label>
                                    <select
                                        className="form-input form-select text-cream"
                                        value={signUpForm.state}
                                        onChange={(e) => setSignUpForm({ ...signUpForm, state: e.target.value })}
                                        required
                                    >
                                        <option value="">Select State</option>
                                        {US_STATES.map(s => (
                                            <option key={s.code} value={s.code}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group col-span-1">
                                    <label className="form-label">Venue Type</label>
                                    <select
                                        className="form-input form-select text-cream"
                                        value={signUpForm.venueType}
                                        onChange={(e) => setSignUpForm({ ...signUpForm, venueType: e.target.value as VenueType })}
                                        required
                                    >
                                        {VENUE_TYPES.map(t => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group col-span-1">
                                    <label className="form-label">Number of Employees</label>
                                    <select
                                        className="form-input form-select text-cream"
                                        value={signUpForm.employeeRange}
                                        onChange={(e) => setSignUpForm({ ...signUpForm, employeeRange: e.target.value as EmployeeRange })}
                                        required
                                    >
                                        {EMPLOYEE_RANGES.map(r => (
                                            <option key={r.value} value={r.value}>{r.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {error && <div className="alert alert-error col-span-2"><AlertCircle size={16} /> {error}</div>}

                                <div className="col-span-2 mt-2">
                                    <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
                                        Create Your Account <ChevronRight size={18} />
                                    </button>
                                    <p className="terms-text mt-4 text-center">
                                        By signing up, you agree to our <Link to="/terms" className="text-gold underline cursor-pointer">Terms of Service</Link> and <Link to="/privacy" className="text-gold underline cursor-pointer">Privacy Policy</Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    )}

                    {view === 'forgot-password' && (
                        <div className="animate-fade-in">
                            <button
                                className="btn btn-ghost btn-xs mb-4 p-0 flex items-center gap-1"
                                onClick={() => setView('signin')}
                            >
                                <ArrowLeft size={14} /> Back to login
                            </button>
                            <h2 className="form-title text-cream">Reset Password</h2>
                            <p className="form-subtitle text-muted">We'll send you a link to recover your account</p>

                            {message ? (
                                <div className="alert alert-success mt-6">
                                    <CheckCircle2 size={18} /> {message}
                                </div>
                            ) : (
                                <form onSubmit={handleForgotPassword} className="mt-6">
                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-input text-cream"
                                            placeholder="wayne@compliance.com"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {error && <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>}
                                    <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .auth-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          background: var(--metal-950);
        }

        .auth-showcase {
          background: linear-gradient(135deg, var(--metal-900) 0%, #050508 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px;
          position: relative;
          overflow: hidden;
          border-right: 1px solid var(--metal-800);
        }

        .auth-showcase::after {
          content: "";
          position: absolute;
          width: 500px;
          height: 500px;
          bottom: -250px;
          right: -250px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .auth-showcase-content {
          max-width: 520px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 60px;
        }

        .logo-icon.bg-gold {
          background: var(--gold-400);
          color: var(--metal-950);
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
        }

        .logo-text {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .showcase-headlines .title-lg {
          font-size: 3.5rem;
          line-height: 1.1;
          font-weight: 800;
          margin-bottom: 24px;
          font-family: var(--font-display);
        }

        .ai-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: var(--gold-400);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .showcase-headlines .subtitle {
          font-size: 1.25rem;
          line-height: 1.6;
          margin-bottom: 48px;
        }

        .feature-grid {
          display: grid;
          gap: 24px;
        }

        .feature-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .feature-icon {
          color: var(--gold-400);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .auth-showcase-footer {
          margin-top: auto;
          color: var(--text-muted);
        }

        .auth-form-section {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .auth-form-card {
          width: 100%;
          max-width: 520px;
          padding: 48px;
          background: var(--metal-900);
          border: 1px solid var(--metal-800);
        }

        .form-title {
          font-size: 1.875rem;
          font-weight: 700;
          font-family: var(--font-display);
          margin-bottom: 8px;
        }

        .form-subtitle {
          font-size: 1rem;
          margin-bottom: 32px;
        }

        .btn-google {
          background: white;
          color: #333;
          border: 1px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .btn-google:hover {
          background: #f8f8f8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .google-icon {
          width: 20px;
          height: 20px;
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 32px 0;
          color: var(--text-muted-sm);
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--metal-700);
        }

        .divider span {
          padding: 0 16px;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .input-with-icon {
          position: relative;
        }

        .icon-left {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--metal-400);
          pointer-events: none;
        }

        .form-input {
          padding-left: 44px;
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23d4af37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-left: 14px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .col-span-2 {
          grid-column: span 2;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.875rem;
          margin-bottom: 16px;
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .alert-success {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .terms-text {
          font-size: 0.75rem;
          color: var(--text-muted-sm);
        }

        .demo-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 24px 0;
          color: var(--text-muted-sm);
        }

        .demo-divider::before, .demo-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--metal-700);
        }

        .demo-divider span {
          padding: 0 16px;
          font-size: 0.8rem;
        }

        .btn-demo {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
          border: 1px solid var(--gold-400);
          color: var(--gold-400);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-weight: 600;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .btn-demo:hover {
          background: rgba(212, 175, 55, 0.25);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(212, 175, 55, 0.2);
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Stats Section */
        .stats-section {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin: 48px 0;
          padding: 24px;
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 12px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--gold-400);
          font-family: var(--font-display);
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Testimonials Section */
        .testimonials-section {
          margin: 48px 0;
        }

        .testimonials-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-cream);
          margin-bottom: 24px;
          text-align: center;
          opacity: 0.9;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .testimonial-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 20px;
          position: relative;
        }

        .testimonial-stars {
          display: flex;
          gap: 4px;
          margin-bottom: 12px;
        }

        .star-filled {
          color: var(--gold-400);
          fill: var(--gold-400);
        }

        .testimonial-quote-icon {
          position: absolute;
          top: 16px;
          right: 16px;
          color: rgba(212, 175, 55, 0.2);
        }

        .testimonial-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 16px;
          font-style: italic;
        }

        .testimonial-author {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 12px;
        }

        .testimonial-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-cream);
        }

        .testimonial-role {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Trust Badges */
        .trust-badges {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--text-muted);
          opacity: 0.8;
        }

        .trust-badge svg {
          color: var(--gold-400);
        }

        @media (max-width: 1024px) {
          .auth-container {
            grid-template-columns: 1fr;
          }
          .auth-showcase {
            display: none;
          }
        }

        @media (max-width: 1200px) {
          .stats-section {
            grid-template-columns: repeat(2, 1fr);
          }
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
          .trust-badges {
            flex-wrap: wrap;
            gap: 16px;
          }
        }
      `}</style>
        </div>
    );
}
