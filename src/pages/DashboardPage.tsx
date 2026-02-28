import {
    ClipboardCheck,
    Users,
    AlertTriangle,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle,
    Clock,
    XCircle,
    BarChart3,
    Activity,
    Sparkles,
    Moon
} from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    demoStats,
    demoChecklists,
    demoInspectionLogs,
    demoCertifications,
    demoIncidents,
} from '../data/demo';

export default function DashboardPage() {
    const { user } = useAuth();

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const pendingChecklists = demoChecklists.filter(
        (c) => c.status !== 'completed'
    );
    const recentLogs = demoInspectionLogs.slice(0, 5);
    const expiringCerts = demoCertifications.filter((c) => {
        const daysLeft = Math.ceil(
            (c.expiryDate.getTime() - Date.now()) / 86400000
        );
        return daysLeft <= 60;
    });

    const insights = [
        { do: "Deep clean the soda gun.", dont: "Question the origins of the mystery syrup." },
        { do: "Label the walk-in prep correctly.", dont: "Hide the health inspector's clipboard." },
        { do: "Check the fire extinguisher tags.", dont: "Assume 'flambé' covers all accidental kitchen fires." },
        { do: "Smile at the difficult table.", dont: "Cry in the walk-in cooler during rush." },
        { do: "Verify every ID at the door.", dont: "Accept a library card as proof of age." },
        { do: "Sweep the line after service.", dont: "Kick the dropped fries under the lowboy." },
        { do: "Record the fridge temps.", dont: "Just write '38°F' down the entire log sheet." },
    ];

    const [dailyInsight, setDailyInsight] = useState(insights[0]);

    useEffect(() => {
        // Pick a pseudo-random insight based on the day of the year
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        setDailyInsight(insights[dayOfYear % insights.length]);
    }, []);

    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <div className="flex justify-between items-end">
                    <div>
                        <h1>
                            {greeting()}, {user?.firstName || user?.displayName?.split(' ')[0] || 'Boss'} 👋
                        </h1>
                        <p>
                            Here's your compliance snapshot for{' '}
                            {format(new Date(), 'EEEE, MMMM do yyyy')}
                        </p>
                    </div>
                    {user?.auditState && (
                        <div className="audit-badge card" style={{ padding: '8px 16px', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}>
                            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--gold-400)', fontWeight: 700, letterSpacing: '0.05em' }}>Audit Jurisdiction</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-cream)', fontWeight: 600 }}>{user.auditState} Compliance</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Daily Cosmic Insight (Co-Star Style) */}
            <div className="card" style={{
                marginBottom: 28,
                background: 'linear-gradient(135deg, rgba(20,20,22,1) 0%, rgba(30,30,35,1) 100%)',
                border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.05, color: '#fff' }}>
                    <Moon size={120} />
                </div>
                <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
                    <Sparkles size={16} color="var(--gold-400)" />
                    <h2 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>
                        Your Daily Alignment
                    </h2>
                </div>

                <div className="grid grid-2" style={{ gap: 24, position: 'relative', zIndex: 1 }}>
                    <div style={{ borderLeft: '2px solid var(--accent-emerald)', paddingLeft: 16 }}>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-emerald)', letterSpacing: '0.1em', marginBottom: 4 }}>Do</div>
                        <div style={{ fontSize: '1.1rem', color: 'var(--text-cream)', fontFamily: 'var(--font-display)' }}>
                            {dailyInsight.do}
                        </div>
                    </div>
                    <div style={{ borderLeft: '2px solid var(--accent-rose)', paddingLeft: 16 }}>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-rose)', letterSpacing: '0.1em', marginBottom: 4 }}>Don't</div>
                        <div style={{ fontSize: '1.1rem', color: 'var(--text-cream)', fontFamily: 'var(--font-display)' }}>
                            {dailyInsight.dont}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-4" style={{ marginBottom: 28 }}>
                <div className="stat-card">
                    <div
                        className="stat-icon"
                        style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}
                    >
                        <TrendingUp size={20} />
                    </div>
                    <div className="stat-value">{demoStats.complianceScore}%</div>
                    <div className="stat-label">Compliance Score</div>
                    <div
                        style={{
                            marginTop: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: '0.75rem',
                            color: '#34d399',
                        }}
                    >
                        <ArrowUpRight size={14} /> +2.1% from last week
                    </div>
                </div>

                <div className="stat-card">
                    <div
                        className="stat-icon"
                        style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}
                    >
                        <ClipboardCheck size={20} />
                    </div>
                    <div className="stat-value">{demoStats.totalInspections}</div>
                    <div className="stat-label">Total Inspections</div>
                    <div
                        style={{
                            marginTop: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: '0.75rem',
                            color: '#34d399',
                        }}
                    >
                        <ArrowUpRight size={14} /> {demoStats.passRate}% pass rate
                    </div>
                </div>

                <div className="stat-card">
                    <div
                        className="stat-icon"
                        style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}
                    >
                        <Clock size={20} />
                    </div>
                    <div className="stat-value">{demoStats.pendingTasks}</div>
                    <div className="stat-label">Pending Tasks</div>
                    <div
                        style={{
                            marginTop: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: '0.75rem',
                            color: '#fbbf24',
                        }}
                    >
                        <Activity size={14} /> Needs attention
                    </div>
                </div>

                <div className="stat-card">
                    <div
                        className="stat-icon"
                        style={{ background: 'rgba(251,113,133,0.15)', color: '#fb7185' }}
                    >
                        <AlertTriangle size={20} />
                    </div>
                    <div className="stat-value">{demoStats.expiringCerts}</div>
                    <div className="stat-label">Expiring Certs</div>
                    <div
                        style={{
                            marginTop: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: '0.75rem',
                            color: '#fb7185',
                        }}
                    >
                        <ArrowDownRight size={14} /> Action required
                    </div>
                </div>
            </div>

            {/* Two column layout */}
            <div className="grid grid-2" style={{ alignItems: 'start' }}>
                {/* Active Checklists */}
                <div className="card">
                    <div
                        className="flex items-center justify-between"
                        style={{ marginBottom: 20 }}
                    >
                        <h2
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                            }}
                        >
                            <ClipboardCheck
                                size={18}
                                style={{
                                    display: 'inline',
                                    verticalAlign: 'middle',
                                    marginRight: 8,
                                    color: 'var(--gold-400)',
                                }}
                            />
                            Active Checklists
                        </h2>
                        <span className="badge badge-pending">
                            {pendingChecklists.length} open
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {pendingChecklists.map((cl) => {
                            const done = cl.items.filter((i) => i.isDone).length;
                            const total = cl.items.length;
                            const pct = Math.round((done / total) * 100);
                            return (
                                <div
                                    key={cl.id}
                                    style={{
                                        padding: '14px 16px',
                                        background: 'var(--bg-elevated)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-default)',
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                    marginBottom: 4,
                                                }}
                                            >
                                                {cl.title}
                                            </div>
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                <span
                                                    className={`badge badge-${cl.category === 'health'
                                                        ? 'pass'
                                                        : cl.category === 'fire'
                                                            ? 'fail'
                                                            : cl.category === 'alcohol'
                                                                ? 'info'
                                                                : 'pending'
                                                        }`}
                                                >
                                                    {cl.category}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        color: 'var(--text-muted)',
                                                    }}
                                                >
                                                    {cl.type.replace('_', '-')}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div
                                                style={{
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    color:
                                                        pct === 100
                                                            ? 'var(--accent-emerald)'
                                                            : 'var(--text-secondary)',
                                                }}
                                            >
                                                {done}/{total}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="progress-bar" style={{ marginTop: 10 }}>
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                    <h2
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            marginBottom: 20,
                        }}
                    >
                        <BarChart3
                            size={18}
                            style={{
                                display: 'inline',
                                verticalAlign: 'middle',
                                marginRight: 8,
                                color: 'var(--gold-400)',
                            }}
                        />
                        Recent Inspection Logs
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {recentLogs.length > 0 ? (
                            recentLogs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-center justify-between"
                                    style={{
                                        padding: '12px 14px',
                                        background: 'var(--bg-elevated)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-default)',
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        {log.status === 'Pass' ? (
                                            <CheckCircle size={18} color="#34d399" />
                                        ) : (
                                            <XCircle size={18} color="#fb7185" />
                                        )}
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {log.category} Inspection
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '0.75rem',
                                                    color: 'var(--text-muted)',
                                                }}
                                            >
                                                {log.completedBy} ·{' '}
                                                {format(log.timestamp, 'MMM d, h:mm a')}
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        className={`badge ${log.status === 'Pass' ? 'badge-pass' : 'badge-fail'
                                            }`}
                                    >
                                        {log.score}%
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                No recent activity. Logs will appear here once audits are completed.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom row — Expiring Certs + Open Incidents */}
            <div className="grid grid-2" style={{ marginTop: 20, alignItems: 'start' }}>
                {/* Expiring Certifications */}
                <div className="card">
                    <h2
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            marginBottom: 20,
                        }}
                    >
                        <Users
                            size={18}
                            style={{
                                display: 'inline',
                                verticalAlign: 'middle',
                                marginRight: 8,
                                color: 'var(--accent-amber)',
                            }}
                        />
                        Expiring Certifications
                    </h2>
                    {expiringCerts.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            All certifications are current ✅
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {expiringCerts.map((cert) => {
                                const daysLeft = Math.ceil(
                                    (cert.expiryDate.getTime() - Date.now()) / 86400000
                                );
                                return (
                                    <div
                                        key={cert.id}
                                        className="flex items-center justify-between"
                                        style={{
                                            padding: '12px 14px',
                                            background: 'var(--bg-elevated)',
                                            borderRadius: 'var(--radius-md)',
                                            border: `1px solid ${daysLeft <= 14
                                                ? 'rgba(251,113,133,0.3)'
                                                : 'var(--border-default)'
                                                }`,
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                                {cert.staffName}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '0.75rem',
                                                    color: 'var(--text-muted)',
                                                }}
                                            >
                                                {cert.type} · Expires{' '}
                                                {format(cert.expiryDate, 'MMM d, yyyy')}
                                            </div>
                                        </div>
                                        <span
                                            className={`badge ${daysLeft <= 14 ? 'badge-fail' : 'badge-pending'
                                                }`}
                                        >
                                            {daysLeft}d left
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Open Incidents */}
                <div className="card">
                    <h2
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            marginBottom: 20,
                        }}
                    >
                        <AlertTriangle
                            size={18}
                            style={{
                                display: 'inline',
                                verticalAlign: 'middle',
                                marginRight: 8,
                                color: 'var(--accent-rose)',
                            }}
                        />
                        Open Incidents
                    </h2>
                    {demoIncidents.filter((i) => !i.resolved).length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            No open incidents 🎉
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {demoIncidents
                                .filter((i) => !i.resolved)
                                .map((inc) => (
                                    <div
                                        key={inc.id}
                                        style={{
                                            padding: '12px 14px',
                                            background: 'var(--bg-elevated)',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-default)',
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                                {inc.title}
                                            </div>
                                            <span
                                                className={`badge ${inc.severity === 'high' || inc.severity === 'critical'
                                                    ? 'badge-fail'
                                                    : 'badge-pending'
                                                    }`}
                                            >
                                                {inc.severity}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-muted)',
                                                marginTop: 4,
                                            }}
                                        >
                                            Reported by {inc.reportedBy} ·{' '}
                                            {format(inc.reportedAt, 'MMM d, h:mm a')}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
