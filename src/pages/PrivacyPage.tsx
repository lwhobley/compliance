import { Lock, UserCheck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div style={{
                    width: 64, height: 64, borderRadius: '50%', background: 'rgba(52,211,153,0.1)', color: 'var(--accent-emerald)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
                }}>
                    <Lock size={32} />
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: 16 }}>Privacy Policy & Rights</h1>
                <p>Last Updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="card" style={{ padding: 40, lineHeight: 1.6 }}>
                <p style={{ marginBottom: 24, fontSize: '1.1rem' }}>
                    Welcome to ComplianceDaddy's Privacy Policy. We respect your privacy and are committed to protecting your personal operations data.
                </p>

                <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 16, marginTop: 32 }}>
                    <UserCheck size={20} color="var(--gold-400)" /> 1. Data We Collect
                </h2>
                <p style={{ marginBottom: 24 }}>
                    We collect operational data that you intentionally inject into the system, including checklist records, staff certification files, employee metrics, incident reports, and POS integration analytics. Our authentication uses industry-standard Firebase Auth and our payments securely route strictly through Stripe APIs. We never store credit card numbers on our servers.
                </p>

                <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 16, marginTop: 32 }}>
                    <Shield size={20} color="var(--gold-400)" /> 2. How We Use Data
                </h2>
                <p style={{ marginBottom: 24 }}>
                    Your data is solely used to:
                    <ul style={{ paddingLeft: 24, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <li>Provide you with compliance auditing output files dynamically tailored to your state regulations.</li>
                        <li>Give AI-powered resolutions based specifically on your voice inputs.</li>
                        <li>Communicate important application, subscription, and security updates.</li>
                        <li>Improve the overall machine learning dataset for broader regulatory analysis (fully anonymized).</li>
                    </ul>
                </p>

                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 16, marginTop: 32 }}>
                    3. AI Data Processing Disclaimer
                </h2>
                <div style={{ padding: 16, background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, marginBottom: 24 }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>
                        We process voice recordings and checklist inputs using generative AI technologies (such as the Gemini API) to synthesize actionable operational resolutions. When using the voice or AI features, do not record or input personally identifying information (PII) of your staff or patrons—such as full names, social security numbers, or sensitive medical histories—as these prompts are routed through third-party foundational models for processing.
                    </p>
                </div>

                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 16, marginTop: 32 }}>
                    4. Your Rights
                </h2>
                <p style={{ marginBottom: 24 }}>
                    Depending on your jurisdiction, you may have the right to request access to the personal data we hold about you, to request that we correct any inaccuracies, or to request deletion of your account and operational history entirely. To execute a data deletion request, contact engineering via your settings dashboard.
                </p>
            </div>

            <div style={{ textAlign: 'center', marginTop: 32 }}>
                <Link to="/" className="btn btn-secondary">
                    <Shield size={16} style={{ marginRight: 8 }} /> Return to Application
                </Link>
            </div>
        </div>
    );
}
