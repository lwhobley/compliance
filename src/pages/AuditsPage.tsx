import { useState, useMemo } from 'react';
import {
    ClipboardCheck,
    MapPin,
    Search,
    AlertTriangle,
    ShieldCheck,
    BookOpen,
    Building,
    Mic,
    MicOff,
    Bot,
    Sparkles,
    Check,
    X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { US_STATES } from '../data/states';
import auditsData from '../data/audits.json';

type AuditType = 'preopening' | 'health' | 'alcohol';

const AuditItemCard = ({ item, type }: { item: any; type: AuditType }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiResolution, setAiResolution] = useState('');
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    const [status, setStatus] = useState<'pass' | 'fail' | null>(null);

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

    const handleAIResolution = (problemText: string, item: any) => {
        setIsProcessingAI(true);
        // Simulate AI thinking and streaming response
        setTimeout(() => {
            setIsProcessingAI(false);

            // Generate a smart sounding response based on the audit
            const templateText =
                `AI Recommended Action for [${item.task}]:\n\n` +
                `Based on your voice note ("${problemText}"), there is a critical discrepancy with the requirement to "${item.requirement}".\n\n` +
                `1) Immediate Fix: Halt related operations and assign a manager to address the cited issue.\n` +
                `2) Documentation: Log the exact problem in the incident report to avoid fines.\n` +
                `3) Prevention Action: Schedule a 5-minute staff huddle covering this exact standard before the next shift.`;

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
        <div style={{
            padding: '16px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
        }}>
            <div className="flex justify-between items-start">
                <div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.task}
                    </div>
                    {item.requirement && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            {item.requirement}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {type === 'preopening' ? (
                        <button
                            onClick={() => setStatus(status === 'pass' ? null : 'pass')}
                            className={`checklist-checkbox ${status === 'pass' ? 'checked' : ''}`}
                            style={{
                                width: 24,
                                height: 24,
                                flexShrink: 0,
                                border: '2px solid var(--metal-600)',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                background: status === 'pass' ? 'var(--gold-400)' : 'transparent'
                            }}
                        >
                            {status === 'pass' && <Check size={16} color="var(--metal-950)" strokeWidth={3} />}
                        </button>
                    ) : (
                        <div
                            style={{
                                display: 'flex',
                                background: 'rgba(0,0,0,0.2)',
                                padding: '3px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-default)',
                                gap: '2px'
                            }}
                        >
                            <button
                                onClick={() => setStatus(status === 'pass' ? null : 'pass')}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: status === 'pass' ? 'rgba(52, 211, 153, 0.2)' : 'transparent',
                                    color: status === 'pass' ? 'var(--accent-emerald)' : 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Check size={14} strokeWidth={3} /> PASS
                            </button>
                            <button
                                onClick={() => setStatus(status === 'fail' ? null : 'fail')}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: status === 'fail' ? 'rgba(251, 113, 133, 0.2)' : 'transparent',
                                    color: status === 'fail' ? 'var(--accent-rose)' : 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <X size={14} strokeWidth={3} /> FAIL
                            </button>
                        </div>
                    )}
                    <button
                        onClick={startRecording}
                        className={`btn btn-xs ${isRecording ? 'btn-red' : 'btn-ghost'}`}
                        style={{
                            padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s ease',
                            backgroundColor: isRecording ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                            color: isRecording ? '#ef4444' : 'var(--text-secondary)',
                            borderRadius: '8px',
                            border: '1px solid var(--border-default)'
                        }}
                        title="Record Problem Note"
                    >
                        {isRecording ? <><MicOff size={14} className="animate-pulse" /> REC</> : <><Mic size={14} /> VOICE</>}
                    </button>
                </div>
            </div>

            {transcript && (
                <div style={{ padding: '12px', background: 'var(--metal-900)', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><em>"{transcript}"</em></p>
                </div>
            )}

            {isProcessingAI && (
                <div className="flex items-center gap-2 mt-2" style={{ color: 'var(--gold-400)', fontSize: '0.85rem' }}>
                    <Sparkles size={14} className="animate-pulse" />
                    <span>Compliance AI analyzing problem...</span>
                </div>
            )}

            {aiResolution && (
                <div style={{
                    marginTop: 8,
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

export default function AuditsPage() {
    const { user } = useAuth();

    // Try to default to the user's state, otherwise Alabama
    // user.auditState might be the agency name or state code, so let's match safely.
    const defaultState = US_STATES.find(s =>
        s.code === user?.state || s.auditAuthority === user?.auditState
    )?.name || 'Alabama';

    const [selectedState, setSelectedState] = useState(defaultState);
    const [activeTab, setActiveTab] = useState<AuditType>('preopening');
    const [searchQuery, setSearchQuery] = useState('');

    // The parsed data
    const stateData = (auditsData as any)[selectedState] || {};
    const currentItems = stateData[activeTab] || [];

    // Group items by category
    const groupedItems = useMemo(() => {
        const groups: Record<string, typeof currentItems> = {};
        currentItems.forEach((item: any) => {
            // Filter by search
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                if (!item.task.toLowerCase().includes(q) && !item.requirement.toLowerCase().includes(q)) {
                    return;
                }
            }
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
        });
        return groups;
    }, [currentItems, searchQuery]);

    return (
        <div>
            <div className="page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1>State-Specific Audits</h1>
                        <p>Official compliance requirements and inspection checklists.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="input-with-icon" style={{ width: '240px' }}>
                            <MapPin size={18} className="icon-left" />
                            <select
                                className="form-input form-select text-cream"
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                style={{ appearance: 'none', paddingLeft: '40px' }}
                            >
                                {US_STATES.map(s => (
                                    <option key={s.name} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs" style={{ marginBottom: 24 }}>
                <button
                    className={`tab ${activeTab === 'preopening' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('preopening')}
                >
                    <Building size={16} />
                    Venue Pre-Opening
                </button>
                <button
                    className={`tab ${activeTab === 'health' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('health')}
                >
                    <ShieldCheck size={16} />
                    Health Compliance
                </button>
                <button
                    className={`tab ${activeTab === 'alcohol' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('alcohol')}
                >
                    <AlertTriangle size={16} />
                    Alcohol Compliance
                </button>
            </div>

            {/* Toolbar */}
            <div className="card" style={{ padding: '16px 20px', marginBottom: 24 }}>
                <div className="flex items-center gap-4">
                    <div className="input-with-icon" style={{ flex: 1 }}>
                        <Search size={18} className="icon-left" />
                        <input
                            type="text"
                            className="form-input"
                            placeholder={`Search ${selectedState} ${activeTab} requirements...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="badge badge-info flex items-center gap-2" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                        <BookOpen size={16} />
                        {currentItems.length} Requirements
                    </div>
                </div>
            </div>

            {/* Grouped Checklist View */}
            <div className="grid gap-6">
                {Object.entries(groupedItems).length === 0 ? (
                    <div className="card text-center text-muted" style={{ padding: 48 }}>
                        No requirements found for the selected state and criteria.
                    </div>
                ) : (
                    Object.entries(groupedItems).map(([category, items]: [string, any]) => (
                        <div key={category} className="card">
                            <div style={{
                                borderBottom: '1px solid var(--border-default)',
                                paddingBottom: 16,
                                marginBottom: 16,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}>
                                <ClipboardCheck size={20} color="var(--gold-400)" />
                                <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--text-cream)' }}>
                                    {category}
                                </h3>
                                <span className="badge badge-pending" style={{ marginLeft: 'auto' }}>
                                    {items.length} items
                                </span>
                            </div>

                            <div className="flex flex-col gap-3">
                                {items.map((item: any, idx: number) => (
                                    <AuditItemCard key={idx} item={item} type={activeTab} />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
        .input-with-icon { position: relative; }
        .icon-left {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--metal-400);
          pointer-events: none;
        }
        .form-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23d4af37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
        }
      `}</style>
        </div>
    );
}
