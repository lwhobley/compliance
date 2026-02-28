import { useState } from 'react';
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
    Bot
} from 'lucide-react';
import { demoChecklists } from '../data/demo';
import type { Checklist, ChecklistItem, ChecklistCategory } from '../types';

const VoiceChecklistItem = ({ item, toggleItem, checklistId }: { item: ChecklistItem, toggleItem: any, checklistId: string }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiResolution, setAiResolution] = useState('');
    const [isProcessingAI, setIsProcessingAI] = useState(false);

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

    const simulateTyping = (text: string, index: number) => {
        if (index < text.length) {
            setAiResolution(prev => prev + text.charAt(index));
            setTimeout(() => simulateTyping(text, index + 1), 15);
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
        </div>
    );
};

export default function ChecklistsPage() {
    const [checklists, setChecklists] = useState<Checklist[]>(demoChecklists);
    const [activeFilter, setActiveFilter] = useState<'all' | ChecklistCategory>('all');
    const [expandedId, setExpandedId] = useState<string | null>(checklists[0]?.id || null);
    const [showAdd, setShowAdd] = useState(false);

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

    return (
        <div>
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1>Checklists</h1>
                        <p>Digital inspection checklists with photo verification</p>
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
