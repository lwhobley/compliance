import { Lock, CreditCard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function PaywallPage() {
    const { user } = useAuth();

    const handleSubscribe = async (tier: 'basic' | 'pro') => {
        let paymentLink = '';
        if (tier === 'basic') {
            paymentLink = `https://buy.stripe.com/bJeaEY0rm2EY5Bc4Uwcwg02?client_reference_id=${user?.uid || ''}`;
        } else {
            paymentLink = `https://buy.stripe.com/cNi5kE8XS0wQ3t4biUcwg01?client_reference_id=${user?.uid || ''}`;
        }

        // We use Stripe's native browser redirect for payment links to directly attribute to the active user uid 
        window.location.href = paymentLink;
    };

    return (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(212,175,55,0.1)',
                color: 'var(--gold-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
            }}>
                <Lock size={32} />
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
                Your Trial Has Expired
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
                Hey {user?.firstName || 'there'}! It looks like your initial 3-day free trial of ComplianceDaddy has wrapped up. Pick a plan below to unlock your venue and keep your daily operations running smoothly.
            </p>

            <div className="grid grid-2" style={{ gap: '24px', textAlign: 'left' }}>
                {/* Basic Plan */}
                <div className="card" style={{ padding: '32px', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                        Basic Minimum
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 16 }}>
                        $19.99<span style={{ fontSize: '1rem', fontWeight: 400 }}>/mo</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32, color: 'var(--text-muted)' }}>
                        <div className="flex items-center gap-2"><ShieldCheck size={16} color="var(--accent-emerald)" /> Digital Daily Checklists</div>
                        <div className="flex items-center gap-2"><ShieldCheck size={16} color="var(--accent-emerald)" /> 50 Photo Logs Daily</div>
                        <div className="flex items-center gap-2"><ShieldCheck size={16} color="var(--accent-emerald)" /> Seafood Labeling Alerts</div>
                        <div className="flex items-center gap-2"><ShieldCheck size={16} color="var(--accent-emerald)" /> 3 Staff Cert Tracking</div>
                    </div>
                    <button
                        className="btn btn-secondary w-full mt-auto"
                        onClick={() => handleSubscribe('basic')}
                        style={{ padding: '12px' }}
                    >
                        <CreditCard size={18} /> Subscribe to Basic
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="card" style={{
                    padding: '32px',
                    border: '2px solid var(--gold-400)',
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.05), transparent)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: -12,
                        right: 24,
                        background: 'var(--gold-400)',
                        color: 'var(--metal-950)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                    }}>
                        Recommended
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--gold-400)', marginBottom: 8 }}>
                        Compliance Pro
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
                        $39.99<span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/mo</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32, color: 'var(--text-cream)' }}>
                        <div className="flex items-center gap-2"><ShieldCheck size={16} color="var(--gold-400)" /> Everything in Basic</div>
                        <div className="flex items-center gap-2"><ShieldCheck size={16} color="var(--gold-400)" /> Infinite Staff Certs</div>
                        <div className="flex items-center gap-2"><ShieldCheck size={16} color="var(--gold-400)" /> Inspector Mode PDF Output</div>
                        <div className="flex items-center gap-2"><ShieldCheck size={16} color="var(--gold-400)" /> Live AI Compliance Resolutions</div>
                    </div>
                    <button
                        className="btn btn-primary w-full mt-auto"
                        onClick={() => handleSubscribe('pro')}
                        style={{ padding: '12px', background: 'var(--gold-500)', color: 'black' }}
                    >
                        <CreditCard size={18} /> Subscribe to Pro
                    </button>
                </div>
            </div>

            <p style={{ marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Payments securely processed via Stripe. Cancel anytime.
            </p>
        </div>
    );
}
