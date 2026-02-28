import { useState } from 'react';
import {
    CheckCircle,
    XCircle,
    Filter,
    TrendingUp,
    Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import { demoInspectionLogs } from '../data/demo';

export default function InspectionsPage() {
    const [filter, setFilter] = useState<'all' | 'Pass' | 'Fail'>('all');

    const logs =
        filter === 'all'
            ? demoInspectionLogs
            : demoInspectionLogs.filter((l) => l.status === filter);

    const passCount = demoInspectionLogs.filter((l) => l.status === 'Pass').length;
    const failCount = demoInspectionLogs.filter((l) => l.status === 'Fail').length;
    const avgScore = demoInspectionLogs.length > 0
        ? Math.round(demoInspectionLogs.reduce((a, b) => a + b.score, 0) / demoInspectionLogs.length)
        : 0;

    return (
        <div>
            <div className="page-header">
                <h1>Inspection Logs</h1>
                <p>Time-stamped inspection records for health, fire, and alcohol compliance</p>
            </div>

            {/* Stats */}
            <div className="grid grid-3" style={{ marginBottom: 24 }}>
                <div className="stat-card">
                    <div
                        className="stat-icon"
                        style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}
                    >
                        <CheckCircle size={20} />
                    </div>
                    <div className="stat-value">{passCount}</div>
                    <div className="stat-label">Passed</div>
                </div>
                <div className="stat-card">
                    <div
                        className="stat-icon"
                        style={{ background: 'rgba(251,113,133,0.15)', color: '#fb7185' }}
                    >
                        <XCircle size={20} />
                    </div>
                    <div className="stat-value">{failCount}</div>
                    <div className="stat-label">Failed</div>
                </div>
                <div className="stat-card">
                    <div
                        className="stat-icon"
                        style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold-400)' }}
                    >
                        <TrendingUp size={20} />
                    </div>
                    <div className="stat-value">{avgScore}%</div>
                    <div className="stat-label">Avg Score</div>
                </div>
            </div>

            {/* Table */}
            <div className="card" style={{ padding: 0 }}>
                <div
                    className="flex items-center justify-between"
                    style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)' }}
                >
                    <div className="flex items-center gap-2">
                        <Filter size={16} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Filter:
                        </span>
                    </div>
                    <div className="tabs" style={{ marginBottom: 0, background: 'transparent', border: 'none', padding: 0 }}>
                        {(['all', 'Pass', 'Fail'] as const).map((f) => (
                            <button
                                key={f}
                                className={`tab ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f === 'all' ? 'All' : f}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Category</th>
                                <th>Score</th>
                                <th>Inspector</th>
                                <th>Items</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? (
                                logs.map((log) => (
                                    <tr key={log.id}>
                                        <td>
                                            <span
                                                className={`badge ${log.status === 'Pass' ? 'badge-pass' : 'badge-fail'
                                                    }`}
                                            >
                                                {log.status === 'Pass' ? (
                                                    <CheckCircle size={12} />
                                                ) : (
                                                    <XCircle size={12} />
                                                )}
                                                {log.status}
                                            </span>
                                        </td>
                                        <td style={{ textTransform: 'capitalize' }}>{log.category}</td>
                                        <td>
                                            <span
                                                style={{
                                                    fontWeight: 700,
                                                    color:
                                                        log.score >= 90
                                                            ? 'var(--accent-emerald)'
                                                            : log.score >= 70
                                                                ? 'var(--accent-amber)'
                                                                : 'var(--accent-rose)',
                                                }}
                                            >
                                                {log.score}%
                                            </span>
                                        </td>
                                        <td>{log.completedBy}</td>
                                        <td>
                                            {log.passedItems}/{log.totalItems}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} color="var(--text-muted)" />
                                                {format(log.timestamp, 'MMM d, yyyy')}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                                        No inspection logs found. Perform your first audit to see records here.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
