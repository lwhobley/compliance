import { useState } from 'react';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Plus,
    X,
    Users as UsersIcon,
    Camera,
} from 'lucide-react';
import { format } from 'date-fns';
import { demoIncidents } from '../data/demo';
import type { Incident, IncidentSeverity } from '../types';

export default function IncidentsPage() {
    const [incidents] = useState<Incident[]>(demoIncidents);
    const [showCreate, setShowCreate] = useState(false);
    const [viewIncident, setViewIncident] = useState<Incident | null>(null);
    const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

    const filtered =
        filter === 'all'
            ? incidents
            : filter === 'open'
                ? incidents.filter((i) => !i.resolved)
                : incidents.filter((i) => i.resolved);

    const getSeverityStyle = (sev: IncidentSeverity) => {
        switch (sev) {
            case 'critical': return { bg: 'rgba(251,113,133,0.2)', color: '#fb7185' };
            case 'high': return { bg: 'rgba(251,113,133,0.15)', color: '#fb7185' };
            case 'medium': return { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' };
            case 'low': return { bg: 'rgba(56,189,248,0.15)', color: '#38bdf8' };
        }
    };

    return (
        <div>
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1>Incident Reports</h1>
                        <p>Document incidents for liability protection and insurance records</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                        <Plus size={16} /> Report Incident
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="tabs" style={{ marginBottom: 20 }}>
                {(['all', 'open', 'resolved'] as const).map((f) => (
                    <button
                        key={f}
                        className={`tab ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Incident Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map((inc) => {
                    const sevStyle = getSeverityStyle(inc.severity);
                    return (
                        <div
                            key={inc.id}
                            className="card"
                            style={{
                                padding: '18px 20px',
                                cursor: 'pointer',
                                borderLeft: `3px solid ${sevStyle.color}`,
                            }}
                            onClick={() => setViewIncident(inc)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 'var(--radius-md)',
                                            background: sevStyle.bg,
                                            color: sevStyle.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <AlertTriangle size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                                            {inc.title}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-muted)',
                                                marginTop: 4,
                                            }}
                                        >
                                            Reported by {inc.reportedBy} · {format(inc.reportedAt, 'MMM d, yyyy h:mm a')}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span
                                        className="badge"
                                        style={{ background: sevStyle.bg, color: sevStyle.color }}
                                    >
                                        {inc.severity}
                                    </span>
                                    <span
                                        className={`badge ${inc.resolved ? 'badge-pass' : 'badge-pending'}`}
                                    >
                                        {inc.resolved ? (
                                            <>
                                                <CheckCircle size={12} /> Resolved
                                            </>
                                        ) : (
                                            <>
                                                <Clock size={12} /> Open
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <p
                                style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--text-secondary)',
                                    marginTop: 12,
                                    lineHeight: 1.6,
                                }}
                            >
                                {inc.description.length > 150
                                    ? inc.description.substring(0, 150) + '...'
                                    : inc.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* View Incident Modal */}
            {viewIncident && (
                <div className="modal-overlay" onClick={() => setViewIncident(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
                        <div className="modal-header">
                            <h2>Incident Details</h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setViewIncident(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>
                                {viewIncident.title}
                            </h3>
                            <div className="flex gap-2" style={{ marginBottom: 12 }}>
                                <span
                                    className="badge"
                                    style={{
                                        background: getSeverityStyle(viewIncident.severity).bg,
                                        color: getSeverityStyle(viewIncident.severity).color,
                                    }}
                                >
                                    {viewIncident.severity}
                                </span>
                                <span className={`badge ${viewIncident.resolved ? 'badge-pass' : 'badge-pending'}`}>
                                    {viewIncident.resolved ? 'Resolved' : 'Open'}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                {viewIncident.description}
                            </p>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 12,
                                marginBottom: 16,
                            }}
                        >
                            <div
                                style={{
                                    padding: 12,
                                    background: 'var(--bg-elevated)',
                                    borderRadius: 'var(--radius-md)',
                                }}
                            >
                                <div className="form-label" style={{ marginBottom: 4 }}>
                                    Reported By
                                </div>
                                <div style={{ fontSize: '0.875rem' }}>{viewIncident.reportedBy}</div>
                            </div>
                            <div
                                style={{
                                    padding: 12,
                                    background: 'var(--bg-elevated)',
                                    borderRadius: 'var(--radius-md)',
                                }}
                            >
                                <div className="form-label" style={{ marginBottom: 4 }}>
                                    Date
                                </div>
                                <div style={{ fontSize: '0.875rem' }}>
                                    {format(viewIncident.reportedAt, 'MMM d, yyyy')}
                                </div>
                            </div>
                        </div>

                        {viewIncident.witnesses.length > 0 && (
                            <div style={{ marginBottom: 16 }}>
                                <div className="form-label" style={{ marginBottom: 8 }}>
                                    <UsersIcon size={14} style={{ display: 'inline', marginRight: 4 }} />
                                    Witnesses
                                </div>
                                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                    {viewIncident.witnesses.map((w, i) => (
                                        <span key={i} className="badge badge-info">
                                            {w}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {viewIncident.resolved && (
                            <div
                                style={{
                                    padding: 12,
                                    background: 'rgba(52,211,153,0.08)',
                                    border: '1px solid rgba(52,211,153,0.2)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 16,
                                }}
                            >
                                <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
                                    ✅ Resolved by {viewIncident.resolvedBy} on{' '}
                                    {viewIncident.resolvedAt && format(viewIncident.resolvedAt, 'MMM d, yyyy')}
                                </div>
                            </div>
                        )}

                        {!viewIncident.resolved && (
                            <button className="btn btn-primary w-full">
                                <CheckCircle size={16} /> Mark as Resolved
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Create Incident Modal */}
            {showCreate && (
                <div className="modal-overlay" onClick={() => setShowCreate(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Report New Incident</h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowCreate(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Incident Title</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Brief description of the incident"
                                id="incident-title"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Severity</label>
                            <select className="form-input form-select" id="incident-severity">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-input"
                                placeholder="Detailed description of what happened, when, and where..."
                                id="incident-description"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Witnesses</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Comma-separated names"
                                id="incident-witnesses"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Photos</label>
                            <div
                                style={{
                                    border: '2px dashed var(--border-default)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '24px 20px',
                                    textAlign: 'center',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                }}
                            >
                                <Camera size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
                                <div>Upload photos of the incident</div>
                            </div>
                        </div>
                        <button className="btn btn-primary w-full" onClick={() => setShowCreate(false)}>
                            <AlertTriangle size={16} /> Submit Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
