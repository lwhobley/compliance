import { useState, useEffect, useRef } from 'react';
import {
    ClipboardCheck,
    Check,
    Camera,
    ChevronDown,
    ChevronUp,
    Plus,
    Mic,
    MicOff,
    Sparkles,
    Bot,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    TrendingFlat,
    Shield,
    Zap
} from 'lucide-react';
import { demoChecklists } from '../data/demo';
import type { Checklist, ChecklistItem, ChecklistCategory, AIComplianceAnalysis } from '../types';

interface VoiceChecklistItemProps {
    item: ChecklistItem;
    toggleItem: (checklistId: string, itemId: string) => void;
    checklistId: string;
}

const VoiceChecklistItem = ({ item, toggleItem, checklistId }: VoiceChecklistItemProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiResolution, setAiResolution] = useState('');
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<AIComplianceAnalysis | null>(null);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [hasViolation, setHasViolation] = useState(false);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (aiResolution) {
            analyzeCompliance(aiResolution, item);
        }
    }, [aiResolution, item]);

    // Cleanup typing timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const startRecording = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Voice features. Try Google Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsRecording(true);
            setTranscript('');
            setAiResolution('');
            setAiAnalysis(null);
        };

        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            handleAIResolution(text, item);
        };

        recognition.onerror = (event: any) => {
            setIsRecording(false);
            if (event.error !== 'no-speech') {
                console.error("Speech recognition error:", event.error);
            }
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.start();
    };

    const handleAIResolution = (problemText: string, item: ChecklistItem) => {
        setIsProcessingAI(true);

        // Simulate AI thinking and streaming response
        setTimeout(() => {
            setIsProcessingAI(false);

            // Generate a smart sounding response based on the checklist item
            const templateText =
                `AI Recommended Action for [${item.task}]:\n\n` +
                `Based on your voice note ("${problemText}"), we cannot verify compliance.\n\n` +
                `1) Immediate Fix: Halt operations near this station immediately.\n` +
                `2) Documentation: Log the exact problem in the incident report to avoid fines.\n` +
                `3) Prevention Action: Schedule a 5-minute staff huddle covering this standard.`;

            simulateTyping(templateText, 0);
        }, 1200);
    };

    const analyzeCompliance = (resolution: string, item: ChecklistItem) => {
        // Simulate AI analysis with violation detection
        // TODO: Replace with actual AI API call when backend is ready
        const riskScore = Math.random() * 100;
        const riskLevel = riskScore > 75 ? 'critical' : riskScore > 50 ? 'high' : riskScore > 25 ? 'medium' : 'low';
        const detectedViolation = riskScore > 50; // If risk score is above 50, flag as potential violation

        if (detectedViolation) {
            setHasViolation(true);
            // Show non-blocking notification for violations
            // TODO: Replace alert with toast notification when toast library is integrated
            console.warn(`Potential Violation: ${item.task} - Risk Level: ${riskLevel}`);
        }

        const analysis: AIComplianceAnalysis = {
            id: Date.now().toString(),
            checklistId: 'simulated',
            venueId: 'simulated',
            analysisDate: new Date(),
            riskScore,
            riskLevel,
            recommendations: [
                `Review ${item.task} procedures with staff`,
                `Implement additional safety measures`,
                `Schedule immediate inspection if risk level is high`
            ],
            predictedViolations: [
                {
                    category: 'health',
                    probability: riskScore / 100,
                    severity: riskScore > 75 ? 'critical' : riskScore > 50 ? 'major' : 'minor'
                }
            ],
            complianceTrends: [
                {
                    category: 'health',
                    trend: Math.random() > 0.5 ? 'improving' : 'declining',
                    scoreChange: Math.random() * 10 - 5
                }
            ],
            suggestedChecklistUpdates: [
                {
                    originalTask: item.task,
                    suggestedTask: `Enhanced ${item.task} verification`,
                    reason: 'AI identified potential compliance gaps'
                }
            ]
        };

        setAiAnalysis(analysis);
    };

    const simulateTyping = (text: string, index: number) => {
        if (index < text.length) {
            setAiResolution(prev => prev + text.charAt(index));
            typingTimeoutRef.current = setTimeout(() => simulateTyping(text, index + 1), 15);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={`checklist-item ${item.isDone ? 'completed' : ''}`}>
                <button
                    className={`checklist-checkbox ${item.isDone ? 'checked' : ''}`}
                    onClick={() => toggleItem(checklistId, item.id)}
                >
                    {item.isDone && <Check size={14} color="var(--metal-950)" />}
                </button>
                <span className="checklist-task">{item.task}</span>
                <div className="checklist-actions">
                    <button className="btn btn-ghost btn-icon" title="Add Photo">
                        <Camera size={16} />
                    </button>
                    <button
                        onClick={startRecording}
                        className={`btn btn-icon ${isRecording ? 'btn-red' : 'btn-ghost'}`}
                        style={{
                            backgroundColor: isRecording ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                            color: isRecording ? '#ef4444' : 'inherit'
                        }}
                        title="Voice Note"
                    >
                        {isRecording ? <MicOff size={16} className="animate-pulse" /> : <Mic size={16} />}
                    </button>
                    {aiAnalysis && (
                        <button
                            className="btn btn-ghost btn-icon"
                            onClick={() => setShowAnalysis(!showAnalysis)}
                            title="AI Analysis"
                        >
                            <Sparkles size={16} className={showAnalysis ? 'animate-pulse' : ''} />
                        </button>
                    )}
                </div>
            </div>

            {transcript && (
                <div style={{ padding: '12px', background: 'var(--metal-900)', borderRadius: '6px', borderLeft: '3px solid #ef4444', marginTop: 8, marginLeft: 36 }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><em>"{transcript}"</em></p>
                </div>
            )}

            {isProcessingAI && (
                <div className="flex items-center gap-2 mt-2" style={{ color: 'var(--gold-400)', fontSize: '0.85rem', marginLeft: 36 }}>
                    <Sparkles size={14} className="animate-pulse" />
                    <span>Compliance AI analyzing problem...</span>
                </div>
            )}

            {aiResolution && (
                <div style={{
                    marginTop: 8,
                    marginLeft: 36,
                    padding: '16px',
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.05), rgba(0,0,0,0))',
                    borderRadius: '8px',
                    border: '1px solid var(--gold-600)',
                    position: 'relative'
                }}>
                    <div style={{ position: 'absolute', top: -10, left: 16, background: 'var(--metal-900)', padding: '0 8px', color: 'var(--gold-400)' }}>
                        <Bot size={16} />
                    </div>
                    <pre style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-cream)',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit',
                        lineHeight: '1.5',
                        marginTop: '4px'
                    }}>
                        {aiResolution}
                    </pre>
                </div>
            )}

            {showAnalysis && aiAnalysis && (
                <div style={{
                    marginTop: 8,
                    marginLeft: 36,
                    padding: '16px',
                    background: 'linear-gradient(135deg, rgba(100,100,200,0.1), rgba(0,0,0,0))',
                    borderRadius: '8px',
                    border: '1px solid var(--blue-600)',
                    position: 'relative'
                }}>
                    <div style={{ position: 'absolute', top: -10, left: 16, background: 'var(--metal-900)', padding: '0 8px', color: 'var(--blue-400)' }}>
                        <AlertTriangle size={16} />
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-cream)' }}>
                        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: aiAnalysis.riskLevel === 'critical' ? '#ef4444' : aiAnalysis.riskLevel === 'high' ? '#f59e0b' : aiAnalysis.riskLevel === 'medium' ? '#eab308' : '#10b981' }}>
                                    {aiAnalysis.riskLevel.toUpperCase()}
                                </div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                                    Risk Score: {Math.round(aiAnalysis.riskScore)}%
                                </div>
                            </div>
                            <div style={{ flex: 1, textAlign: 'right' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    {new Date(aiAnalysis.analysisDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '12px', borderLeft: '2px solid var(--blue-400)', paddingLeft: '8px' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>AI Recommendations:</div>
                            <ul style={{ margin: 0, padding: 0, paddingLeft: '16px' }}>
                                {aiAnalysis.recommendations.map((rec, i) => (
                                    <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ marginBottom: '12px', borderLeft: '2px solid var(--gold-400)', paddingLeft: '8px' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Predicted Violations:</div>
                            {aiAnalysis.predictedViolations.map((violation, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ minWidth: '80px' }}>{violation.category}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2px 6px', fontSize: '0.75rem' }}>
                                            {Math.round(violation.probability * 100)}% chance
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: violation.severity === 'critical' ? '#ef4444' : violation.severity === 'major' ? '#f59e0b' : '#3b82f6' }}>
                                        {violation.severity}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginBottom: '12px', borderLeft: '2px solid var(--emerald-400)', paddingLeft: '8px' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Compliance Trends:</div>
                            {aiAnalysis.complianceTrends.map((trend, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ minWidth: '80px' }}>{trend.category}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {trend.trend === 'improving' && <TrendingUp size={12} color="#10b981" />}
                                            {trend.trend === 'declining' && <TrendingDown size={12} color="#ef4444" />}
                                            {trend.trend === 'stable' && <TrendingFlat size={12} color="#6b7280" />}
                                            <span style={{ fontSize: '0.75rem' }}>
                                                {trend.trend} by {Math.abs(trend.scoreChange).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '8px' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Suggested Checklist Updates:</div>
                            {aiAnalysis.suggestedChecklistUpdates.map((update, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ minWidth: '80px', opacity: 0.7 }}>Update:</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ marginBottom: '2px' }}>
                                            <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>{update.originalTask}</span>
                                        </div>
                                        <div style={{ color: '#fbbf24' }}>{update.suggestedTask}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            {update.reason}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function ChecklistsPage() {
    const [checklists, setChecklists] = useState<Checklist[]>(demoChecklists);
    const [activeFilter, setActiveFilter] = useState<'all' | ChecklistCategory>('all');
    const [expandedId, setExpandedId] = useState<string | null>(checklists[0]?.id || null);
    const [showAdd, setShowAdd] = useState(false);
    const [complianceScore, setComplianceScore] = useState<number>(85);
    const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
    const [trend, setTrend] = useState<'improving' | 'declining' | 'stable'>('stable');
    const [lastAnalysis, setLastAnalysis] = useState<Date | null>(new Date());

    const filtered =
        activeFilter === 'all'
            ? checklists
            : checklists.filter((c) => c.category === activeFilter);

    const toggleItem = (checklistId: string, itemId: string) => {
        setChecklists((prev) =>
            prev.map((cl) => {
                if (cl.id !== checklistId) return cl;
                const updatedItems = cl.items.map((item) =>
                    item.id === itemId ? { ...item, isDone: !item.isDone } : item
                );
                const allDone = updatedItems.every((i) => i.isDone);
                return {
                    ...cl,
                    items: updatedItems,
                    status: allDone ? 'completed' : updatedItems.some((i) => i.isDone) ? 'in_progress' : 'pending',
                    completedAt: allDone ? new Date() : undefined,
                };
            })
        );
    };

    const categories: { label: string; value: 'all' | ChecklistCategory }[] = [
        { label: 'All', value: 'all' },
        { label: 'Health', value: 'health' },
        { label: 'Fire', value: 'fire' },
        { label: 'Alcohol', value: 'alcohol' },
        { label: 'General', value: 'general' },
    ];

    const getCategoryColor = (cat: ChecklistCategory) => {
        switch (cat) {
            case 'health': return { bg: 'rgba(52,211,153,0.15)', color: '#34d399' };
            case 'fire': return { bg: 'rgba(251,113,133,0.15)', color: '#fb7185' };
            case 'alcohol': return { bg: 'rgba(56,189,248,0.15)', color: '#38bdf8' };
            default: return { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' };
        }
    };

    const refreshAnalysis = () => {
        // TODO: Replace with actual API call to refresh compliance data
        // Simulate data refresh with random values
        const newScore = Math.floor(Math.random() * 30) + 70; // 70-100 range
        const riskLevels: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
        const trends: ('improving' | 'declining' | 'stable')[] = ['improving', 'declining', 'stable'];

        setComplianceScore(newScore);
        setRiskLevel(riskLevels[Math.floor(Math.random() * riskLevels.length)]);
        setTrend(trends[Math.floor(Math.random() * trends.length)]);
        setLastAnalysis(new Date());
    };

    return (
        <div>
            {/* AI Compliance Score Card */}
            <div className="card" style={{ marginBottom: '16px', padding: '16px', background: 'linear-gradient(135deg, rgba(100,100,200,0.1), rgba(0,0,0,0))', border: '1px solid var(--blue-600)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Shield size={20} color="#3b82f6" />
                        <div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                                {complianceScore}%
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                Overall Compliance Score
                            </div>
                        </div>
                    </div>
                    <div style={{ flex: 1 }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {trend === 'improving' && <TrendingUp size={14} color="#10b981" />}
                            {trend === 'declining' && <TrendingDown size={14} color="#ef4444" />}
                            {trend === 'stable' && <TrendingFlat size={14} color="#6b7280" />}
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                {trend}
                            </span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Last updated: {lastAnalysis ? lastAnalysis.toLocaleDateString() : 'Never'}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Risk Level:</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: riskLevel === 'critical' ? '#ef4444' : riskLevel === 'high' ? '#f59e0b' : riskLevel === 'medium' ? '#eab308' : '#10b981' }}>
                                {riskLevel.toUpperCase()}
                            </div>
                            {riskLevel === 'critical' && <Zap size={14} color="#ef4444" className="animate-pulse" />}
                            {riskLevel === 'high' && <Zap size={14} color="#f59e0b" />}
                            {riskLevel === 'medium' && <Zap size={14} color="#eab308" />}
                            {riskLevel === 'low' && <Zap size={14} color="#10b981" />}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button className="btn btn-ghost btn-icon" title="Refresh Analysis" onClick={refreshAnalysis}>
                            <Zap size={16} />
                        </button>
                        <button className="btn btn-ghost btn-icon" title="View Detailed Report">
                            <AlertTriangle size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1>Checklists</h1>
                        <p>Digital inspection checklists with AI-powered compliance assistance</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                        <Plus size={16} /> New Checklist
                    </button>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="tabs">
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        className={`tab ${activeFilter === cat.value ? 'active' : ''}`}
                        onClick={() => setActiveFilter(cat.value)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Checklist cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filtered.map((cl) => {
                    const done = cl.items.filter((i) => i.isDone).length;
                    const total = cl.items.length;
                    const pct = Math.round((done / total) * 100);
                    const isExpanded = expandedId === cl.id;
                    const catStyle = getCategoryColor(cl.category);

                    return (
                        <div key={cl.id} className="card" style={{ padding: 0 }}>
                            {/* Card header */}
                            <div
                                style={{
                                    padding: '18px 20px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                                onClick={() => setExpandedId(isExpanded ? null : cl.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 'var(--radius-md)',
                                            background: catStyle.bg,
                                            color: catStyle.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <ClipboardCheck size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                                            {cl.title}
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: 8,
                                                alignItems: 'center',
                                                marginTop: 4,
                                            }}
                                        >
                                            <span
                                                className={`badge ${cl.status === 'completed'
                                                    ? 'badge-pass'
                                                    : cl.status === 'in_progress'
                                                        ? 'badge-pending'
                                                        : 'badge-info'
                                                    }`}
                                            >
                                                {cl.status.replace('_', ' ')}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {cl.type.replace('_', '-')} · {done}/{total} items
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div style={{ width: 80 }}>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${pct}%`,
                                                    background:
                                                        pct === 100
                                                            ? 'var(--accent-emerald)'
                                                            : 'linear-gradient(90deg, var(--gold-400), var(--accent-emerald))',
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            color: pct === 100 ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                                            minWidth: 36,
                                            textAlign: 'right',
                                        }}
                                    >
                                        {pct}%
                                    </span>
                                    {isExpanded ? (
                                        <ChevronUp size={18} color="var(--text-muted)" />
                                    ) : (
                                        <ChevronDown size={18} color="var(--text-muted)" />
                                    )}
                                </div>
                            </div>

                            {/* Expanded items */}
                            {isExpanded && (
                                <div
                                    style={{
                                        borderTop: '1px solid var(--border-default)',
                                        padding: '16px 20px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 8,
                                    }}
                                >
                                    {cl.items.map((item) => (
                                        <VoiceChecklistItem key={item.id} item={item} checklistId={cl.id} toggleItem={toggleItem} />
                                    ))}

                                    {/* Submit button */}
                                    {cl.status !== 'completed' && (
                                        <button
                                            className="btn btn-primary w-full"
                                            style={{ marginTop: 8 }}
                                            disabled={!cl.items.every((i) => i.isDone)}
                                        >
                                            <Check size={16} /> Submit Verified Log
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Add Checklist Modal */}
            {showAdd && (
                <div className="modal-overlay" onClick={() => setShowAdd(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create New Checklist</h2>
                            <button
                                className="btn btn-ghost btn-icon"
                                onClick={() => setShowAdd(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Saturday Night Closing"
                                id="checklist-title"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select className="form-input form-select" id="checklist-category">
                                <option value="health">Health</option>
                                <option value="fire">Fire & Safety</option>
                                <option value="alcohol">Alcohol</option>
                                <option value="general">General</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <select className="form-input form-select" id="checklist-type">
                                <option value="pre_opening">Pre-Opening</option>
                                <option value="shift">Shift</option>
                                <option value="closing">Closing</option>
                            </select>
                        </div>
                        <button className="btn btn-primary w-full" onClick={() => setShowAdd(false)}>
                            <Plus size={16} /> Create Checklist
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
