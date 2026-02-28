import { useState } from 'react';
import {
    FileText,
    Download,
    Calendar,
    Shield,
    CheckCircle,
    XCircle,
    Printer,
    Clock,
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { demoInspectionLogs, demoCertifications } from '../data/demo';

export default function InspectorModePage() {
    const [dateRange, setDateRange] = useState(30);
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);

    const filteredLogs = demoInspectionLogs.filter(
        (l) => l.timestamp >= subDays(new Date(), dateRange)
    );

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            setGenerated(true);
        }, 2000);
    };

    const passRate =
        filteredLogs.length > 0
            ? Math.round(
                (filteredLogs.filter((l) => l.status === 'Pass').length / filteredLogs.length) * 100
            )
            : 0;

    return (
        <div className="animate-enter">
            <div className="page-header">
                <h1>
                    <FileText
                        size={24}
                        style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--gold-400)' }}
                    />
                    Inspector Mode
                </h1>
                <p>
                    One-button audit export — show inspectors your complete compliance history
                </p>
            </div>

            {/* Controls */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 16 }}>
                    <div className="flex items-center gap-3">
                        <Calendar size={18} color="var(--gold-400)" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Report Period:</span>
                        <div className="tabs" style={{ marginBottom: 0 }}>
                            {[7, 14, 30, 60, 90].map((d) => (
                                <button
                                    key={d}
                                    className={`tab ${dateRange === d ? 'active' : ''}`}
                                    onClick={() => { setDateRange(d); setGenerated(false); }}
                                >
                                    {d} days
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleGenerate}
                        disabled={generating}
                        id="generate-report"
                    >
                        {generating ? (
                            <>
                                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Shield size={18} /> Generate Report
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Preview */}
            <div
                className="card"
                style={{
                    background: 'var(--cream-100)',
                    color: 'var(--metal-900)',
                    padding: 0,
                    overflow: 'hidden',
                }}
            >
                {/* Report Header */}
                <div
                    style={{
                        background: 'var(--metal-900)',
                        padding: '32px 32px 24px',
                        borderBottom: '3px solid var(--gold-400)',
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '1.5rem',
                                    fontWeight: 800,
                                    color: 'var(--cream-100)',
                                    marginBottom: 4,
                                }}
                            >
                                ComplianceDaddy™ Audit Report
                            </h2>
                            <div style={{ color: 'var(--gold-400)', fontSize: '0.85rem', fontWeight: 600 }}>
                                Official Compliance Record · Generated {format(new Date(), 'MMMM d, yyyy h:mm a')}
                            </div>
                        </div>
                        <div
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 'var(--radius-md)',
                                background: 'linear-gradient(135deg, var(--gold-400), var(--gold-600))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--metal-950)',
                            }}
                        >
                            <Shield size={26} />
                        </div>
                    </div>
                </div>

                {/* Report Body */}
                <div style={{ padding: 32 }}>
                    {/* Venue Info */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: 16,
                            marginBottom: 28,
                        }}
                    >
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Venue
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: 4 }}>
                                The Brass Rail Bar & Grill
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Period
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: 4 }}>
                                {format(subDays(new Date(), dateRange), 'MMM d')} – {format(new Date(), 'MMM d, yyyy')}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Pass Rate
                            </div>
                            <div
                                style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    marginTop: 4,
                                    color: passRate >= 90 ? '#059669' : passRate >= 70 ? '#d97706' : '#dc2626',
                                }}
                            >
                                {passRate}%
                            </div>
                        </div>
                    </div>

                    {/* Inspection Table */}
                    <div style={{ marginBottom: 28 }}>
                        <h3
                            style={{
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                color: 'var(--metal-900)',
                                marginBottom: 12,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            Inspection Summary
                        </h3>
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                fontSize: '0.8rem',
                            }}
                        >
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '8px 12px', background: '#eee', color: '#555', borderRadius: '4px 0 0 0' }}>
                                        Date
                                    </th>
                                    <th style={{ textAlign: 'left', padding: '8px 12px', background: '#eee', color: '#555' }}>
                                        Category
                                    </th>
                                    <th style={{ textAlign: 'left', padding: '8px 12px', background: '#eee', color: '#555' }}>
                                        Inspector
                                    </th>
                                    <th style={{ textAlign: 'left', padding: '8px 12px', background: '#eee', color: '#555' }}>
                                        Score
                                    </th>
                                    <th style={{ textAlign: 'left', padding: '8px 12px', background: '#eee', color: '#555', borderRadius: '0 4px 0 0' }}>
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log) => (
                                    <tr key={log.id}>
                                        <td style={{ padding: '10px 12px', borderBottom: '1px solid #ddd' }}>
                                            {format(log.timestamp, 'MMM d, yyyy')}
                                        </td>
                                        <td style={{ padding: '10px 12px', borderBottom: '1px solid #ddd', textTransform: 'capitalize' }}>
                                            {log.category}
                                        </td>
                                        <td style={{ padding: '10px 12px', borderBottom: '1px solid #ddd' }}>
                                            {log.completedBy}
                                        </td>
                                        <td style={{ padding: '10px 12px', borderBottom: '1px solid #ddd', fontWeight: 700 }}>
                                            {log.score}%
                                        </td>
                                        <td style={{ padding: '10px 12px', borderBottom: '1px solid #ddd' }}>
                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 4,
                                                    color: log.status === 'Pass' ? '#059669' : '#dc2626',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {log.status === 'Pass' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Active Certifications */}
                    <div style={{ marginBottom: 28 }}>
                        <h3
                            style={{
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                color: 'var(--metal-900)',
                                marginBottom: 12,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            Staff Certifications
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {demoCertifications.map((cert) => (
                                <div
                                    key={cert.id}
                                    style={{
                                        padding: '10px 14px',
                                        background: '#f8f8f0',
                                        borderRadius: 6,
                                        border: '1px solid #e0e0d0',
                                        fontSize: '0.8rem',
                                    }}
                                >
                                    <div style={{ fontWeight: 600 }}>{cert.staffName}</div>
                                    <div style={{ color: '#777', marginTop: 2 }}>
                                        {cert.type} · Exp {format(cert.expiryDate, 'MMM d, yyyy')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            borderTop: '2px solid var(--metal-900)',
                            paddingTop: 16,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.75rem',
                            color: '#888',
                        }}
                    >
                        <div>
                            ComplianceDaddy™ by Loungeability LLC · This is an auto-generated compliance
                            document.
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={12} />
                            {format(new Date(), 'h:mm:ss a zzz')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Download actions */}
            {generated && (
                <div
                    className="flex items-center justify-between"
                    style={{ marginTop: 20, flexWrap: 'wrap', gap: 12 }}
                >
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)' }}>
                        <CheckCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                        Report generated successfully
                    </div>
                    <div className="flex gap-2">
                        <button className="btn btn-secondary">
                            <Printer size={16} /> Print
                        </button>
                        <button className="btn btn-primary">
                            <Download size={16} /> Download PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
