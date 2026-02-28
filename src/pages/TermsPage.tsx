import { ShieldCheck, FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div style={{
                    width: 64, height: 64, borderRadius: '50%', background: 'rgba(212,175,55,0.1)', color: 'var(--gold-400)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
                }}>
                    <FileText size={32} />
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: 16 }}>Terms of Service</h1>
                <p>Last Updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="card" style={{ padding: 40, lineHeight: 1.6 }}>
                <div style={{ padding: 16, background: 'rgba(251,113,133,0.1)', borderLeft: '4px solid var(--accent-rose)', borderRadius: '0 8px 8px 0', marginBottom: 32 }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-rose)', marginBottom: 8 }}>
                        <AlertCircle size={18} /> IMPORTANT DISCLAIMER
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>
                        ComplianceDaddy provides software tools and AI functionality designed to assist hospitality operators with organization and record-keeping. <strong>We are NOT a law firm and we do NOT provide legal, regulatory, or tax advice.</strong> Use of this platform does not guarantee compliance with local, state, or federal laws. You remain solely responsible for your venue's compliance and legal standing.
                    </p>
                </div>

                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 16 }}>1. Agreement to Terms</h2>
                <p style={{ marginBottom: 24 }}>
                    By accessing or using ComplianceDaddy, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
                </p>

                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 16 }}>2. Use License</h2>
                <p style={{ marginBottom: 24 }}>
                    Permission is granted to temporarily access the materials (information or software) on ComplianceDaddy's website for personal or commercial use within your organization. This is the grant of a license, not a transfer of title.
                </p>

                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 16 }}>3. AI Generated Content</h2>
                <p style={{ marginBottom: 24 }}>
                    Our AI models generate suggestions based on user input for compliance documentation and action plans. This output is for informational purposes only. You must review and verify all AI-generated content before implementation in your venue.
                </p>

                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 16 }}>4. Subscriptions & Billing</h2>
                <p style={{ marginBottom: 24 }}>
                    Trials last for 3 days. Post-trial, access requires an active subscription via Stripe. All payments are non-refundable except where required by law.
                </p>

                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 16 }}>5. Limitation of Liability</h2>
                <p style={{ marginBottom: 24 }}>
                    In no event shall ComplianceDaddy or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the platform.
                </p>
            </div>

            <div style={{ textAlign: 'center', marginTop: 32 }}>
                <Link to="/" className="btn btn-secondary">
                    <ShieldCheck size={16} style={{ marginRight: 8 }} /> Return to Application
                </Link>
            </div>
        </div>
    );
}
