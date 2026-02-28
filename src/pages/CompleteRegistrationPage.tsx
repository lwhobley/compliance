import { useState, useEffect } from 'react';
import {
  Shield,
  Building,
  ChevronRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { US_STATES, VENUE_TYPES, EMPLOYEE_RANGES } from '../data/states';
import type { VenueType, EmployeeRange, UserProfile } from '../types';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function CompleteRegistrationPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [signUpForm, setSignUpForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    company: '',
    city: '',
    state: '',
    zipcode: '',
    venueType: 'bar' as VenueType,
    employeeRange: '1-10' as EmployeeRange,
  });

  useEffect(() => {
    if (user?.firstName && user?.lastName) {
      setSignUpForm(prev => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName
      }));
    }
  }, [user]);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) return;

    try {
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: `${signUpForm.firstName} ${signUpForm.lastName}`,
        firstName: signUpForm.firstName,
        lastName: signUpForm.lastName,
        company: signUpForm.company,
        city: signUpForm.city,
        state: signUpForm.state,
        zipcode: signUpForm.zipcode,
        venueType: signUpForm.venueType,
        employeeRange: signUpForm.employeeRange,
        auditState: signUpForm.state,
        role: 'admin',
        venueId: `venue-${user.uid}`,
        createdAt: new Date().toISOString() as any,
        subscriptionTier: 'free',
        trialEndsAt: new Date(Date.now() + 3 * 86400000).toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
      // Small delay to allow Firestore listener to update user context
      // before navigation triggers ProtectedRoute check
      setTimeout(() => navigate('/'), 150);
    } catch (err: any) {
      setError(err.message || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side: Branding & Features (Same as AuthPage) */}
      <div className="auth-showcase">
        <div className="auth-showcase-content">
          <div className="logo-section">
            <div className="logo-icon bg-gold">
              <Shield size={32} />
            </div>
            <h1 className="logo-text text-cream font-display">ComplianceDaddy</h1>
          </div>

          <div className="showcase-headlines">
            <h2 className="title-lg text-cream">Almost There...</h2>
            <p className="subtitle text-muted">
              To complete your Google sign-up, we just need a few details about your venue.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-icon"><CheckCircle2 size={20} /></div>
              <div>
                <h4 className="text-cream">Smart Checklists</h4>
                <p className="text-muted-sm">Ready-to-use health & fire templates.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><CheckCircle2 size={20} /></div>
              <div>
                <h4 className="text-cream">Cert Vault</h4>
                <p className="text-muted-sm">Track permits & compliance documents.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Completion Form */}
      <div className="auth-form-section">
        <div className="auth-form-card card shadow-leather animate-enter">
          <div className="animate-fade-in">
            <h2 className="form-title text-cream">Complete Your Venue Profile</h2>
            <p className="form-subtitle text-muted">Help us personalize your compliance experience.</p>

            <form onSubmit={handleComplete} className="mt-6 grid-2 gap-4">
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
              <div className="form-group col-span-2">
                <label className="form-label">Zipcode</label>
                <input
                  type="text"
                  className="form-input text-cream"
                  placeholder="70112"
                  pattern="^\d{5}(-\d{4})?$"
                  maxLength={10}
                  value={signUpForm.zipcode}
                  onChange={(e) => setSignUpForm({ ...signUpForm, zipcode: e.target.value })}
                  required
                />
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
                <label className="form-label">Employees</label>
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
                  {loading ? 'Completing Setup...' : 'Complete My Profile'} <ChevronRight size={18} />
                </button>
                <button
                  type="button"
                  className="btn btn-ghost w-full mt-4 text-xs"
                  onClick={() => signOut()}
                >
                  Cancel and Sign Out
                </button>
              </div>
            </form>
          </div>
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
        }

        .logo-text {
          font-size: 2rem;
          font-weight: 800;
        }

        .showcase-headlines .title-lg {
          font-size: 3.5rem;
          line-height: 1.1;
          font-weight: 800;
          margin-bottom: 24px;
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
          margin-bottom: 8px;
        }

        .form-subtitle {
          font-size: 1rem;
          margin-bottom: 32px;
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
        }

        .form-input {
          padding-left: 44px;
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23d4af37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .col-span-1 {
            grid-column: span 1;
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
          margin-top: 16px;
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .auth-container {
            grid-template-columns: 1fr;
          }
          .auth-showcase {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
