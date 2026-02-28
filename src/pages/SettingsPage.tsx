import { useState } from 'react';
import {
    Building,
    Bell,
    Palette,
    CreditCard,
    Moon,
    Sun,
    Check,
    ExternalLink,
    Store,
    Link2,
    ToggleRight
} from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('venue');

    const tabs = [
        { id: 'venue', label: 'Venue', icon: <Building size={16} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
        { id: 'integrations', label: 'Integrations', icon: <Store size={16} /> },
        { id: 'billing', label: 'Billing', icon: <CreditCard size={16} /> },
        { id: 'appearance', label: 'Appearance', icon: <Palette size={16} /> },
    ];

    return (
        <div className="animate-enter">
            <div className="page-header">
                <h1>Settings</h1>
                <p>Manage your venue, notifications, and billing preferences</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'start' }}>
                {/* Settings Nav */}
                <div className="card" style={{ padding: 8 }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: 'var(--radius-md)',
                                background: activeTab === tab.id ? 'rgba(212,175,55,0.1)' : 'transparent',
                                color: activeTab === tab.id ? 'var(--gold-400)' : 'var(--text-secondary)',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                textAlign: 'left',
                                transition: 'all var(--transition-fast)',
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Settings Content */}
                <div className="card">
                    {activeTab === 'venue' && (
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 24 }}>
                                <Building size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--gold-400)' }} />
                                Venue Details
                            </h2>
                            <div className="form-group">
                                <label className="form-label">Venue Name</label>
                                <input type="text" className="form-input" defaultValue="The Brass Rail Bar & Grill" id="settings-venue-name" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input type="text" className="form-input" defaultValue="New Orleans" id="settings-city" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">State</label>
                                    <input type="text" className="form-input" defaultValue="Louisiana" id="settings-state" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Address</label>
                                <input type="text" className="form-input" defaultValue="123 Bourbon St, New Orleans, LA 70116" id="settings-address" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Timezone</label>
                                <select className="form-input form-select" defaultValue="CST" id="settings-timezone">
                                    <option value="CST">Central (CST)</option>
                                    <option value="EST">Eastern (EST)</option>
                                    <option value="PST">Pacific (PST)</option>
                                    <option value="MST">Mountain (MST)</option>
                                </select>
                            </div>
                            <button className="btn btn-primary" style={{ marginTop: 8 }}>
                                <Check size={16} /> Save Changes
                            </button>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 24 }}>
                                <Bell size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--gold-400)' }} />
                                Notification Preferences
                            </h2>
                            {[
                                { label: 'Certification Expiry Alerts', desc: 'Get notified 30/60 days before permits expire', default: true },
                                { label: 'Daily Checklist Reminders', desc: 'Morning reminder to complete pre-opening checks', default: true },
                                { label: 'Incident Reports', desc: 'Instant notification when a new incident is reported', default: true },
                                { label: 'Weekly Compliance Summary', desc: 'Email digest of your venue\'s compliance score', default: false },
                                { label: 'Seafood Label Alerts', desc: 'Alert when imported items are missing signage', default: true },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between"
                                    style={{
                                        padding: '14px 0',
                                        borderBottom: '1px solid var(--border-default)',
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.label}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                                    </div>
                                    <label style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            defaultChecked={item.default}
                                            style={{ display: 'none' }}
                                        />
                                        <div
                                            style={{
                                                width: 44,
                                                height: 24,
                                                borderRadius: 12,
                                                background: item.default ? 'var(--gold-400)' : 'var(--metal-700)',
                                                position: 'relative',
                                                transition: 'background var(--transition-fast)',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 18,
                                                    height: 18,
                                                    borderRadius: '50%',
                                                    background: 'white',
                                                    position: 'absolute',
                                                    top: 3,
                                                    left: item.default ? 23 : 3,
                                                    transition: 'left var(--transition-fast)',
                                                }}
                                            />
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div>
                            <div className="flex justify-between items-start" style={{ marginBottom: 24 }}>
                                <div>
                                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>
                                        <Store size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--gold-400)' }} />
                                        Point of Sale (POS) Integrations
                                    </h2>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                        Connect your POS system to automatically track high-risk voids, comps, and sales data for compliance auditing.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-2" style={{ gap: 16 }}>
                                {[
                                    { name: 'Toast POS', desc: 'Sync restaurant checks, voids, and comps.', connected: true, brand: '#F97316' },
                                    { name: 'Square', desc: 'Sync cafe & retail transactions automatically.', connected: false, brand: '#374151' },
                                    { name: 'Lightspeed', desc: 'Sync restaurant & bar operations.', connected: false, brand: '#E11D48' },
                                    { name: 'Clover', desc: 'Sync payment terminal data natively.', connected: false, brand: '#10B981' }
                                ].map((pos) => (
                                    <div key={pos.name} className="card" style={{ padding: 20, border: pos.connected ? '1px solid var(--gold-600)' : '1px solid var(--border-default)', background: pos.connected ? 'linear-gradient(to bottom right, rgba(212,175,55,0.05), transparent)' : 'var(--bg-elevated)' }}>
                                        <div className="flex justify-between items-start" style={{ marginBottom: 16 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{ width: 40, height: 40, borderRadius: 8, background: pos.brand, color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                                    {pos.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{pos.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: pos.connected ? 'var(--gold-400)' : 'var(--text-muted)', marginTop: 2 }}>
                                                        {pos.connected ? 'Connected via API key' : 'Not connected'}
                                                    </div>
                                                </div>
                                            </div>
                                            {pos.connected && (
                                                <div style={{ background: 'var(--accent-emerald)', color: '#000', borderRadius: '50%', width: 20, height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Check size={12} />
                                                </div>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                                            {pos.desc}
                                        </p>
                                        <button
                                            className={`btn ${pos.connected ? 'btn-ghost' : 'btn-secondary'} w-full`}
                                            style={{ color: pos.connected ? 'var(--text-muted)' : '', opacity: pos.connected ? 0.7 : 1 }}
                                        >
                                            {pos.connected ? (
                                                <><ToggleRight size={14} /> Manage Sync Settings</>
                                            ) : (
                                                <><Link2 size={14} /> Connect {pos.name}</>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="card text-center" style={{ marginTop: 24, padding: 32, borderStyle: 'dashed', background: 'transparent' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                                    Don't see your POS provider? Let our engineering team know.
                                </p>
                                <button className="btn btn-ghost">Request Integration</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 24 }}>
                                <CreditCard size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--gold-400)' }} />
                                Billing & Subscription
                            </h2>

                            {/* Current Plan */}
                            <div
                                style={{
                                    padding: 20,
                                    background: 'rgba(212,175,55,0.08)',
                                    border: '1px solid rgba(212,175,55,0.2)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 24,
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                            Current Plan
                                        </div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginTop: 4 }}>
                                            Pro Plan
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                            $39.99/month · Unlimited staff · All features
                                        </div>
                                    </div>
                                    <button className="btn btn-secondary">
                                        <ExternalLink size={14} /> Manage Billing
                                    </button>
                                </div>
                            </div>

                            {/* Plan Comparison */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div
                                    style={{
                                        padding: 20,
                                        background: 'var(--bg-elevated)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-default)',
                                    }}
                                >
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>Basic</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-secondary)' }}>
                                        $19.99<span style={{ fontSize: '0.8rem', fontWeight: 400 }}>/mo</span>
                                    </div>
                                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <div>✓ Digital Daily Checklists</div>
                                        <div>✓ Photo Logs (50/day)</div>
                                        <div>✓ Seafood Labeling Alerts</div>
                                        <div>✓ 3 Staff Cert Tracking</div>
                                        <div style={{ color: 'var(--text-muted)', opacity: 0.5 }}>✗ Inspector Mode PDF</div>
                                        <div style={{ color: 'var(--text-muted)', opacity: 0.5 }}>✗ Incident Reporting</div>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        padding: 20,
                                        background: 'var(--bg-elevated)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '2px solid var(--gold-400)',
                                        position: 'relative',
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: -10,
                                            right: 16,
                                            background: 'var(--gold-400)',
                                            color: 'var(--metal-950)',
                                            padding: '2px 10px',
                                            borderRadius: 100,
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        Current Plan
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>Pro</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--gold-400)' }}>
                                        $39.99<span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/mo</span>
                                    </div>
                                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        <div>✓ Everything in Basic</div>
                                        <div>✓ Unlimited Staff Certs</div>
                                        <div style={{ color: 'var(--accent-emerald)' }}>✓ Inspector Mode PDF</div>
                                        <div style={{ color: 'var(--accent-emerald)' }}>✓ Incident Reporting</div>
                                        <div style={{ color: 'var(--accent-emerald)' }}>✓ Multi-Location</div>
                                        <div style={{ color: 'var(--accent-emerald)' }}>✓ Priority Support</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 24 }}>
                                <Palette size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--gold-400)' }} />
                                Appearance
                            </h2>
                            <div className="form-group">
                                <label className="form-label">Theme</label>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <div
                                        style={{
                                            width: 120,
                                            height: 80,
                                            borderRadius: 'var(--radius-md)',
                                            background: 'var(--metal-900)',
                                            border: '2px solid var(--gold-400)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            position: 'relative',
                                        }}
                                    >
                                        <Moon size={20} color="var(--cream-100)" />
                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: -6,
                                                background: 'var(--gold-400)',
                                                color: 'var(--metal-950)',
                                                padding: '1px 8px',
                                                borderRadius: 100,
                                                fontSize: '0.65rem',
                                                fontWeight: 700,
                                            }}
                                        >
                                            Active
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            width: 120,
                                            height: 80,
                                            borderRadius: 'var(--radius-md)',
                                            background: '#f5f5dc',
                                            border: '2px solid transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            opacity: 0.6,
                                        }}
                                    >
                                        <Sun size={20} color="#333" />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginTop: 24 }}>
                                <label className="form-label">Accent Color</label>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    {[
                                        { color: '#d4af37', label: 'Gold' },
                                        { color: '#34d399', label: 'Emerald' },
                                        { color: '#38bdf8', label: 'Sky' },
                                        { color: '#a78bfa', label: 'Purple' },
                                        { color: '#fb7185', label: 'Rose' },
                                    ].map((c) => (
                                        <div
                                            key={c.color}
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 'var(--radius-sm)',
                                                background: c.color,
                                                cursor: 'pointer',
                                                border: c.color === '#d4af37' ? '2px solid white' : '2px solid transparent',
                                                transition: 'transform var(--transition-fast)',
                                            }}
                                            title={c.label}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
