import { useState } from 'react';
import {
    Users,
    AlertTriangle,
    CheckCircle,
    Clock,
    Upload,
    Plus,
    Search,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { demoCertifications } from '../data/demo';
import type { StaffCertification } from '../types';

export default function CertificationsPage() {
    const [certs] = useState<StaffCertification[]>(demoCertifications);
    const [search, setSearch] = useState('');
    const [showUpload, setShowUpload] = useState(false);

    const filtered = search
        ? certs.filter(
            (c) =>
                c.staffName.toLowerCase().includes(search.toLowerCase()) ||
                c.type.toLowerCase().includes(search.toLowerCase())
        )
        : certs;

    const getStatus = (cert: StaffCertification) => {
        const days = differenceInDays(cert.expiryDate, new Date());
        if (days <= 0) return { label: 'Expired', color: 'badge-fail', icon: <AlertTriangle size={12} /> };
        if (days <= 30) return { label: `${days}d left`, color: 'badge-fail', icon: <Clock size={12} /> };
        if (days <= 60) return { label: `${days}d left`, color: 'badge-pending', icon: <Clock size={12} /> };
        return { label: 'Active', color: 'badge-pass', icon: <CheckCircle size={12} /> };
    };

    const expiringSoon = certs.filter((c) => differenceInDays(c.expiryDate, new Date()) <= 60);
    const active = certs.filter((c) => differenceInDays(c.expiryDate, new Date()) > 60);

    return (
        <div>
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1>Staff Certifications</h1>
                        <p>Track ServSafe, RVP, TABC, and health permits with auto-expiry alerts</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
                        <Upload size={16} /> Upload Certificate
                    </button>
                </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-3" style={{ marginBottom: 24 }}>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}>
                        <CheckCircle size={20} />
                    </div>
                    <div className="stat-value">{active.length}</div>
                    <div className="stat-label">Active Certs</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                        <Clock size={20} />
                    </div>
                    <div className="stat-value">{expiringSoon.length}</div>
                    <div className="stat-label">Expiring Soon</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}>
                        <Users size={20} />
                    </div>
                    <div className="stat-value">{certs.length}</div>
                    <div className="stat-label">Total Staff</div>
                </div>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 20 }}>
                <Search
                    size={16}
                    style={{
                        position: 'absolute',
                        left: 14,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                    }}
                />
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search by name or certification type..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ paddingLeft: 40 }}
                    id="cert-search"
                />
            </div>

            {/* Cert Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map((cert) => {
                    const status = getStatus(cert);
                    const days = differenceInDays(cert.expiryDate, new Date());

                    return (
                        <div key={cert.id} className="card" style={{ padding: '16px 20px' }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        style={{
                                            width: 42,
                                            height: 42,
                                            borderRadius: 'var(--radius-md)',
                                            background: 'linear-gradient(135deg, var(--gold-400), var(--gold-600))',
                                            color: 'var(--metal-950)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontFamily: 'var(--font-display)',
                                            fontWeight: 700,
                                            fontSize: '0.9rem',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {cert.staffName.split(' ').map((n) => n[0]).join('')}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                                            {cert.staffName}
                                        </div>
                                        <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
                                            <span className="badge badge-info">{cert.type}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                Issued {format(cert.issuedDate, 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className={`badge ${status.color}`}>
                                        {status.icon} {status.label}
                                    </span>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                        Expires {format(cert.expiryDate, 'MMM d, yyyy')}
                                    </div>
                                </div>
                            </div>

                            {/* Expiry progress */}
                            {days <= 90 && days > 0 && (
                                <div style={{ marginTop: 12 }}>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${Math.max(0, Math.min(100, (days / 90) * 100))}%`,
                                                background:
                                                    days <= 14
                                                        ? 'var(--accent-rose)'
                                                        : days <= 30
                                                            ? 'var(--accent-amber)'
                                                            : 'var(--accent-emerald)',
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Upload Modal */}
            {showUpload && (
                <div className="modal-overlay" onClick={() => setShowUpload(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Upload Certificate</h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowUpload(false)}>
                                ✕
                            </button>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Staff Member</label>
                            <input type="text" className="form-input" placeholder="Name" id="cert-staff-name" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Certification Type</label>
                            <select className="form-input form-select" id="cert-type-select">
                                <option value="ServSafe">ServSafe</option>
                                <option value="RVP">Responsible Vendor Permit</option>
                                <option value="TABC">TABC</option>
                                <option value="FoodHandler">Food Handler</option>
                                <option value="HealthPermit">Health Permit</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Expiration Date</label>
                            <input type="date" className="form-input" id="cert-expiry" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Upload File</label>
                            <div
                                style={{
                                    border: '2px dashed var(--border-default)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '30px 20px',
                                    textAlign: 'center',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                }}
                            >
                                <Upload size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
                                <div>Click or drag to upload certificate image</div>
                                <div style={{ fontSize: '0.75rem', marginTop: 4 }}>PNG, JPG, PDF up to 10MB</div>
                            </div>
                        </div>
                        <button className="btn btn-primary w-full" onClick={() => setShowUpload(false)}>
                            <Plus size={16} /> Save Certificate
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
