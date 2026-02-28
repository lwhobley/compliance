import {
    ClipboardCheck,
    AlertTriangle,
    CheckCircle,
    XCircle,
    BarChart3,
    Sparkles,
    Plus,
    ShieldAlert,
    Rocket,
    Send,
    MessageSquare,
    Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
    demoChecklists,
    demoInspectionLogs,
    demoCertifications,
} from '../data/demo';
import { AnimatedCounter, CircularProgress } from '../components/AnimatedCounter';

export default function DashboardPage() {
    const { user } = useAuth();
    const [showQuickAction, setShowQuickAction] = useState(false);
    const [shiftNotes, setShiftNotes] = useState<{ id: string, text: string, user: string, time: Date }[]>([
        { id: '1', text: 'Walk-in fridge compressor making a weird noise. Keep an eye on the temp log.', user: 'Sarah (AM)', time: new Date(Date.now() - 3600000) },
        { id: '2', text: 'Health inspector rumored to be in the parish. Double check all sanitizer buckets.', user: 'Mike (AM)', time: new Date(Date.now() - 7200000) }
    ]);
    const [newNote, setNewNote] = useState('');

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
        return daysLeft <= 30;
    });

    // Setup Progress Calculation
    const setupSteps = [
        { label: 'Create Venue Profile', done: !!user?.company },
        { label: 'Initial Audit Run', done: demoInspectionLogs.length > 0 },
        { label: 'Upload Staff Certs', done: demoCertifications.length > 0 },
        { label: 'Setup Subscription', done: user?.subscriptionTier !== 'free' }
    ];
    const progressPct = Math.round((setupSteps.filter(s => s.done).length / setupSteps.length) * 100);

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
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        setDailyInsight(insights[dayOfYear % insights.length]);
    }, []);

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        setShiftNotes([{
            id: Date.now().toString(),
            text: newNote,
            user: `${user?.firstName || 'Me'} (Live)`,
            time: new Date()
        }, ...shiftNotes]);
        setNewNote('');
    };

    return (
        <div style={{ paddingBottom: 100 }}>
            {/* 🚨 CRITICAL ALERTS BAR */}
            {expiringCerts.length > 0 && (
                <div className="alert-bar animate-slide-down">
                    <div className="flex items-center gap-3">
                        <div className="alert-pulse">
                            <ShieldAlert size={20} />
                        </div>
                        <span style={{ fontWeight: 600 }}>Action Required:</span>
                        <span style={{ color: 'var(--text-cream)', opacity: 0.9 }}>
                            {expiringCerts.length} certification{expiringCerts.length > 1 ? 's' : ''} expiring soon.
                        </span>
                    </div>
                    <Link to="/certifications" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                        Resolve Now
                    </Link>
                </div>
            )}

            {/* Header */}
            <div className="page-header">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="font-display">
                            {greeting()}, {user?.firstName || user?.displayName?.split(' ')[0] || 'Boss'} 👋
                        </h1>
                        <p className="text-muted">
                            {format(new Date(), 'EEEE, MMMM do yyyy')} | {user?.company || 'Your Venue'}
                        </p>
                    </div>
                    {user?.auditState && (
                        <div className="audit-badge card">
                            <div className="badge-label">Jurisdiction</div>
                            <div className="badge-value">{user.auditState} Compliance</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Top Operational Row */}
            <div className="grid grid-3 gap-6" style={{ marginBottom: 28 }}>
                {/* Setup Progress */}
                <div className="card dashboard-card animate-enter delay-1">
                    <div className="flex items-center gap-2 mb-4">
                        <Rocket size={18} className="text-gold" />
                        <h2 className="card-title">Setup Progress</h2>
                    </div>
                    <div className="progress-container">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <CircularProgress percentage={progressPct} size={50} strokeWidth={4} />
                                <div>
                                    <div className="text-lg font-bold text-gold">
                                        <AnimatedCounter value={progressPct} suffix="%" />
                                    </div>
                                    <div className="text-xs text-muted">COMPLIANT</div>
                                </div>
                            </div>
                            <span className="text-xs text-muted">{setupSteps.filter(s => s.done).length}/{setupSteps.length} Steps</span>
                        </div>
                        <div className="progress-bar-lg">
                            <div className="progress-fill-gradient" style={{ width: `${progressPct}%` }} />
                        </div>
                    </div>
                    <div className="setup-list mt-4">
                        {setupSteps.map((step, i) => (
                            <div key={i} className={`setup-item ${step.done ? 'done' : ''}`}>
                                {step.done ? <CheckCircle size={14} className="text-emerald" /> : <div className="dot" />}
                                <span>{step.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Star Inspection - Emergency Quick Link */}
                <Link to="/inspector-mode" className="card inspector-promo-card animate-enter delay-2">
                    <div className="inspector-promo-content">
                        <ShieldAlert size={40} className="mb-2 text-rose" />
                        <h2 className="font-display text-white">Inspector On Site?</h2>
                        <p className="text-rose-200 text-xs mb-4">Lock down the interface and show them what they need.</p>
                        <div className="btn btn-rose w-full flex items-center justify-center gap-2 font-bold">
                            START INSPECTOR MODE <Zap size={16} fill="currentColor" />
                        </div>
                    </div>
                </Link>

                {/* Daily Insight */}
                <div className="card insight-card animate-enter delay-3">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={18} className="text-gold" />
                        <h2 className="card-title">Operations Alignment</h2>
                    </div>
                    <div className="insight-grid">
                        <div className="insight-item do">
                            <span className="tag">DO</span>
                            <p>{dailyInsight.do}</p>
                        </div>
                        <div className="insight-item dont">
                            <span className="tag">DON'T</span>
                            <p>{dailyInsight.dont}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Operational Grid */}
            <div className="grid grid-3 gap-6">
                {/* Shift Log / Handover Notes */}
                <div className="card col-span-1 animate-enter delay-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="card-title">
                            <MessageSquare size={18} className="text-gold mr-2" />
                            Manager Shift Log
                        </h2>
                    </div>
                    <form onSubmit={handleAddNote} className="mb-4 flex gap-2">
                        <input
                            type="text"
                            className="form-input text-xs"
                            placeholder="Add a shift note..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                        />
                        <button type="submit" className="btn btn-ghost p-2">
                            <Send size={16} />
                        </button>
                    </form>
                    <div className="shift-notes-list">
                        {shiftNotes.map(note => (
                            <div key={note.id} className="shift-note">
                                <div className="note-header">
                                    <span className="note-user">{note.user}</span>
                                    <span className="note-time">{format(note.time, 'h:mm a')}</span>
                                </div>
                                <p className="note-text">{note.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Operations */}
                <div className="card col-span-1 animate-enter delay-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="card-title">
                            <ClipboardCheck size={18} className="text-emerald mr-2" />
                            Live Checklists
                        </h2>
                        <span className="badge badge-pending">{pendingChecklists.length} Open</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {pendingChecklists.map((cl) => {
                            const done = cl.items.filter((i) => i.isDone).length;
                            const total = cl.items.length;
                            const pct = Math.round((done / total) * 100);
                            return (
                                <Link to="/checklists" key={cl.id} className="checklist-preview-card">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-bold text-sm text-cream">{cl.title}</div>
                                        <div className="text-xs text-muted">{done}/{total}</div>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Compliance History */}
                <div className="card col-span-1 animate-enter delay-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="card-title">
                            <BarChart3 size={18} className="text-sky mr-2" />
                            Recent Accuracy
                        </h2>
                    </div>
                    <div className="flex flex-col gap-2">
                        {recentLogs.map((log) => (
                            <div key={log.id} className="history-item">
                                <div className="flex items-center gap-3">
                                    {log.status === 'Pass' ? (
                                        <CheckCircle size={14} className="text-emerald" />
                                    ) : (
                                        <XCircle size={14} className="text-rose" />
                                    )}
                                    <span className="text-xs font-semibold text-cream">{log.category} Audit</span>
                                </div>
                                <span className={`text-xs font-bold ${log.status === 'Pass' ? 'text-emerald' : 'text-rose'}`}>
                                    {log.score}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="fab-container">
                {showQuickAction && (
                    <div className="fab-menu animate-scale-in">
                        <Link to="/incidents" className="fab-sub-button">
                            <AlertTriangle size={18} />
                            <span>Report Incident</span>
                        </Link>
                        <Link to="/checklists" className="fab-sub-button">
                            <Plus size={18} />
                            <span>Start Checklist</span>
                        </Link>
                    </div>
                )}
                <button
                    className={`fab-main-button ${showQuickAction ? 'active' : ''}`}
                    onClick={() => setShowQuickAction(!showQuickAction)}
                >
                    <Plus size={24} />
                </button>
            </div>

            <style>{`
                .alert-bar {
                    background: linear-gradient(to right, rgba(251, 113, 133, 0.2), rgba(251, 113, 133, 0.05));
                    border: 1px solid rgba(251, 113, 133, 0.3);
                    border-radius: var(--radius-md);
                    padding: 12px 20px;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .alert-pulse {
                    color: var(--accent-rose);
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .audit-badge {
                    padding: 8px 16px !important;
                    background: rgba(212,175,55,0.05) !important;
                    border: 1px solid rgba(212,175,55,0.2) !important;
                }

                .badge-label {
                    font-size: 0.6rem;
                    text-transform: uppercase;
                    color: var(--gold-400);
                    font-weight: 700;
                    letter-spacing: 0.05em;
                }

                .badge-value {
                    font-size: 0.8rem;
                    color: var(--text-cream);
                    font-weight: 600;
                }

                .progress-bar-lg {
                    height: 8px;
                    background: var(--metal-800);
                    border-radius: 100px;
                    overflow: hidden;
                    margin: 8px 0;
                }

                .progress-fill-gradient {
                    height: 100%;
                    background: linear-gradient(to right, var(--gold-600), var(--gold-400));
                    border-radius: 100px;
                    transition: width 1s ease-out;
                }

                .setup-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    margin-bottom: 8px;
                }

                .setup-item.done {
                    color: var(--text-cream);
                }

                .setup-item .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--metal-700);
                }

                .inspector-promo-card {
                    background: linear-gradient(135deg, #450a0a 0%, #1a0505 100%);
                    border: 1px solid rgba(251, 113, 133, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    text-decoration: none;
                    transition: transform 0.2s;
                }

                .inspector-promo-card:hover {
                    transform: translateY(-4px);
                    border-color: var(--accent-rose);
                }

                .insight-card {
                    background: var(--metal-900);
                }

                .insight-grid {
                    display: grid;
                    gap: 12px;
                }

                .insight-item {
                    padding: 10px;
                    border-radius: 8px;
                    background: var(--metal-800);
                    border-left: 3px solid transparent;
                }

                .insight-item.do { border-color: var(--accent-emerald); }
                .insight-item.dont { border-color: var(--accent-rose); }

                .insight-item .tag {
                    font-size: 0.6rem;
                    font-weight: 900;
                    letter-spacing: 0.05em;
                    margin-bottom: 2px;
                    display: block;
                }

                .do .tag { color: var(--accent-emerald); }
                .dont .tag { color: var(--accent-rose); }

                .insight-item p {
                    font-size: 0.85rem;
                    color: var(--text-cream);
                    line-height: 1.4;
                }

                .shift-note {
                    padding: 10px;
                    background: var(--metal-800);
                    border-radius: 8px;
                    margin-bottom: 8px;
                    border: 1px solid var(--metal-700);
                }

                .note-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 4px;
                }

                .note-user {
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: var(--gold-400);
                }

                .note-time {
                    font-size: 0.65rem;
                    color: var(--text-muted);
                }

                .note-text {
                    font-size: 0.8rem;
                    color: var(--text-cream);
                }

                .checklist-preview-card {
                    padding: 12px;
                    background: var(--metal-800);
                    border-radius: 8px;
                    text-decoration: none;
                    border: 1px solid transparent;
                    transition: all 0.2s;
                }

                .checklist-preview-card:hover {
                    border-color: var(--metal-600);
                    background: var(--metal-700);
                }

                .history-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 12px;
                    background: rgba(255,255,255,0.02);
                    border-radius: 6px;
                }

                .fab-container {
                    position: fixed;
                    right: 32px;
                    bottom: 32px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 16px;
                    z-index: 1000;
                }

                .fab-main-button {
                    width: 56px;
                    height: 56px;
                    border-radius: 28px;
                    background: var(--gold-500);
                    color: var(--metal-950);
                    border: none;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 0 4px rgba(212, 175, 55, 0.2);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .fab-main-button.active {
                    transform: rotate(45deg);
                    background: var(--metal-700);
                    color: var(--text-cream);
                }

                .fab-menu {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .fab-sub-button {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 16px;
                    background: var(--metal-800);
                    border: 1px solid var(--metal-700);
                    color: var(--text-cream);
                    border-radius: 100px;
                    text-decoration: none;
                    font-size: 0.85rem;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    white-space: nowrap;
                    transition: transform 0.2s;
                }

                .fab-sub-button:hover {
                    transform: scale(1.05);
                    background: var(--metal-700);
                }

                .animate-slide-down {
                    animation: slideDown 0.4s ease-out;
                }

                @keyframes slideDown {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .animate-scale-in {
                    animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    transform-origin: bottom right;
                }

                @keyframes scaleIn {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
