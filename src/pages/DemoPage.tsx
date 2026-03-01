import { useState, useEffect } from 'react';
import {
    Shield,
    Check,
    Sparkles,
    ArrowRight,
    AlertTriangle,
    Mic,
    Star,
    Clock,
    Users,
    FileCheck,
    X
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample demo checklist data
const DEMO_CHECKLIST = {
    id: 'demo-1',
    title: 'Opening Health Inspection',
    category: 'health',
    items: [
        { id: '1', task: 'Check refrigerator temperatures (below 41°F)', isDone: true, hasViolation: false },
        { id: '2', task: 'Verify handwashing stations are stocked', isDone: true, hasViolation: false },
        { id: '3', task: 'Check food storage labels and dates', isDone: false, hasViolation: true, aiWarning: 'AI detected: 3 items without proper date labels' },
        { id: '4', task: 'Clean and sanitize prep surfaces', isDone: false, hasViolation: false },
        { id: '5', task: 'Verify pest control logs are current', isDone: false, hasViolation: false },
    ]
};

// Sample AI analysis
const DEMO_AI_ANALYSIS = {
    riskScore: 73,
    riskLevel: 'high',
    recommendations: [
        'Implement daily label verification protocol',
        'Add backup date labels in prep area',
        'Schedule staff training on FIFO system'
    ],
    predictedViolations: [
        { category: 'food-storage', probability: 0.85, severity: 'major' }
    ]
};

function AnimatedCounter({ end, duration = 1500 }: { end: number; duration?: number }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [end, duration]);
    return <span>{count}</span>;
}

export default function DemoPage() {
    const [activeTab, setActiveTab] = useState<'checklist' | 'ai' | 'dashboard'>('checklist');
    const [checklistItems, setChecklistItems] = useState(DEMO_CHECKLIST.items);
    const [showingAIResolution, setShowingAIResolution] = useState(false);
    const [aiTyping, setAiTyping] = useState('');
    const [demoStep, setDemoStep] = useState(0);

    // Demo tour steps
    const demoSteps = [
        "Welcome! This is a demo of ComplianceDaddy's AI-powered checklists.",
        "Try clicking an incomplete task to see AI recommendations...",
        "Watch how AI predicts violations before they happen!",
        "Ready to transform your compliance process?"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setDemoStep((prev) => (prev + 1) % demoSteps.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const toggleItem = (id: string) => {
        setChecklistItems(prev => prev.map(item => {
            if (item.id === id) {
                const newItem = { ...item, isDone: !item.isDone };
                // Trigger AI demo on specific item
                if (id === '3' && !item.isDone) {
                    setTimeout(() => setShowingAIResolution(true), 500);
                    setTimeout(() => {
                        setAiTyping('');
                        const message = "⚠️ Violation Risk Detected:\n\nI've identified 3 food containers without proper date labels. This is a common violation that carries a $250-$500 fine.\n\n✓ Recommendation: Implement daily label checks during opening procedures.\n\n✓ Would you like me to add this to your daily checklist?";
                        let i = 0;
                        const typeInterval = setInterval(() => {
                            if (i < message.length) {
                                setAiTyping(prev => prev + message.charAt(i));
                                i++;
                            } else {
                                clearInterval(typeInterval);
                            }
                        }, 20);
                    }, 800);
                }
                return newItem;
            }
            return item;
        }));
    };

    const completionRate = Math.round((checklistItems.filter(i => i.isDone).length / checklistItems.length) * 100);

    return (
        <div className="demo-container">
            {/* Demo Banner */}
            <div className="demo-banner">
                <div className="demo-banner-content">
                    <span className="demo-badge">
                        <Sparkles size={14} /> LIVE DEMO
                    </span>
                    <span className="demo-text">Try before you buy - No signup required</span>
                </div>
                <Link to="/auth" className="demo-cta">
                    Sign Up Free <ArrowRight size={16} />
                </Link>
            </div>

            {/* Main Demo Area */}
            <div className="demo-layout">
                {/* Sidebar */}
                <div className="demo-sidebar">
                    <div className="demo-logo">
                        <Shield size={28} />
                        <span>ComplianceDaddy</span>
                    </div>

                    <nav className="demo-nav">
                        <button
                            className={`demo-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <Star size={18} /> Dashboard
                        </button>
                        <button
                            className={`demo-nav-item ${activeTab === 'checklist' ? 'active' : ''}`}
                            onClick={() => setActiveTab('checklist')}
                        >
                            <FileCheck size={18} /> Checklists
                        </button>
                        <button
                            className={`demo-nav-item ${activeTab === 'ai' ? 'active' : ''}`}
                            onClick={() => setActiveTab('ai')}
                        >
                            <Sparkles size={18} /> AI Assistant
                        </button>
                    </nav>

                    <div className="demo-stats">
                        <div className="demo-stat">
                            <Clock size={16} />
                            <span>Demo Mode</span>
                        </div>
                        <div className="demo-stat">
                            <Users size={16} />
                            <span>Sample Venue</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="demo-main">
                    {/* Demo Tour Message */}
                    <div className="demo-tour">
                        <button className="demo-tour-close" onClick={() => setDemoStep(-1)}>
                            <X size={16} />
                        </button>
                        <p>{demoSteps[demoStep]}</p>
                        <div className="demo-tour-dots">
                            {demoSteps.map((_, i) => (
                                <div key={i} className={`dot ${i === demoStep ? 'active' : ''}`} />
                            ))}
                        </div>
                    </div>

                    {activeTab === 'checklist' && (
                        <div className="demo-checklist">
                            <div className="demo-checklist-header">
                                <h2>{DEMO_CHECKLIST.title}</h2>
                                <div className="demo-progress">
                                    <div className="demo-progress-bar">
                                        <div
                                            className="demo-progress-fill"
                                            style={{ width: `${completionRate}%` }}
                                        />
                                    </div>
                                    <span>{completionRate}% Complete</span>
                                </div>
                            </div>

                            <div className="demo-checklist-items">
                                {checklistItems.map(item => (
                                    <div
                                        key={item.id}
                                        className={`demo-item ${item.isDone ? 'done' : ''} ${item.aiWarning ? 'warning' : ''}`}
                                        onClick={() => toggleItem(item.id)}
                                    >
                                        <div className={`demo-checkbox ${item.isDone ? 'checked' : ''}`}>
                                            {item.isDone && <Check size={14} />}
                                        </div>
                                        <span className="demo-task">{item.task}</span>
                                        {item.aiWarning && (
                                            <div className="demo-ai-badge">
                                                <AlertTriangle size={14} />
                                                {item.aiWarning}
                                            </div>
                                        )}
                                        {!item.isDone && !item.aiWarning && (
                                            <button className="demo-mic-btn">
                                                <Mic size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {showingAIResolution && (
                                <div className="demo-ai-panel">
                                    <div className="demo-ai-header">
                                        <Sparkles size={18} className="animate-pulse" />
                                        <span>AI Compliance Assistant</span>
                                    </div>
                                    <pre className="demo-ai-message">{aiTyping}</pre>
                                    <button
                                        className="demo-ai-action"
                                        onClick={() => setShowingAIResolution(false)}
                                    >
                                        Add to Checklist
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'ai' && (
                        <div className="demo-ai-dashboard">
                            <h2>AI Risk Analysis</h2>
                            <div className="demo-risk-score">
                                <div className="demo-score-circle" style={{ '--score': DEMO_AI_ANALYSIS.riskScore } as any}>
                                    <AnimatedCounter end={DEMO_AI_ANALYSIS.riskScore} />
                                    <span>%</span>
                                </div>
                                <div className="demo-risk-level high">
                                    {DEMO_AI_ANALYSIS.riskLevel.toUpperCase()} RISK
                                </div>
                            </div>

                            <div className="demo-ai-sections">
                                <div className="demo-ai-section">
                                    <h4>AI Recommendations</h4>
                                    <ul>
                                        {DEMO_AI_ANALYSIS.recommendations.map((rec, i) => (
                                            <li key={i}><Check size={14} /> {rec}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="demo-ai-section">
                                    <h4>Predicted Violations</h4>
                                    {DEMO_AI_ANALYSIS.predictedViolations.map((vio, i) => (
                                        <div key={i} className="demo-violation">
                                            <span className="demo-vio-category">{vio.category}</span>
                                            <div className="demo-vio-prob">
                                                <div className="demo-prob-bar">
                                                    <div style={{ width: `${vio.probability * 100}%` }} />
                                                </div>
                                                <span>{Math.round(vio.probability * 100)}% chance</span>
                                            </div>
                                            <span className={`demo-vio-severity ${vio.severity}`}>{vio.severity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'dashboard' && (
                        <div className="demo-dashboard">
                            <h2>Compliance Dashboard</h2>
                            <div className="demo-metrics">
                                <div className="demo-metric">
                                    <div className="demo-metric-value">
                                        <AnimatedCounter end={85} />%
                                    </div>
                                    <div className="demo-metric-label">Compliance Score</div>
                                </div>
                                <div className="demo-metric">
                                    <div className="demo-metric-value">
                                        <AnimatedCounter end={12} />
                                    </div>
                                    <div className="demo-metric-label">Days Since Last Incident</div>
                                </div>
                                <div className="demo-metric">
                                    <div className="demo-metric-value">
                                        <AnimatedCounter end={3} />
                                    </div>
                                    <div className="demo-metric-label">Certs Expiring Soon</div>
                                </div>
                            </div>

                            <div className="demo-chart-placeholder">
                                <div className="demo-chart-title">Compliance Trend (Last 30 Days)</div>
                                <div className="demo-bars">
                                    {[65, 72, 68, 75, 82, 78, 85].map((h, i) => (
                                        <div key={i} className="demo-bar" style={{ height: `${h}%` }}>
                                            <div className="demo-bar-fill" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating CTA */}
            <div className="demo-floating-cta">
                <div className="demo-cta-content">
                    <p>Ready to ace your next inspection?</p>
                    <Link to="/auth" className="demo-cta-button">
                        Start Free Trial <ArrowRight size={18} />
                    </Link>
                </div>
            </div>

            <style>{`
                .demo-container {
                    min-height: 100vh;
                    background: var(--metal-950);
                    color: var(--text-cream);
                    font-family: var(--font-body);
                }

                .demo-banner {
                    background: linear-gradient(90deg, var(--gold-400), #f59e0b);
                    color: var(--metal-950);
                    padding: 12px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .demo-banner-content {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .demo-badge {
                    background: rgba(0,0,0,0.2);
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .demo-text {
                    font-weight: 600;
                }

                .demo-cta {
                    background: var(--metal-950);
                    color: var(--gold-400);
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-weight: 600;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                }

                .demo-cta:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                .demo-layout {
                    display: grid;
                    grid-template-columns: 260px 1fr;
                    min-height: calc(100vh - 50px);
                }

                .demo-sidebar {
                    background: var(--metal-900);
                    border-right: 1px solid var(--metal-800);
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                }

                .demo-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--gold-400);
                    margin-bottom: 40px;
                }

                .demo-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    flex: 1;
                }

                .demo-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border-radius: 8px;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }

                .demo-nav-item:hover,
                .demo-nav-item.active {
                    background: rgba(212, 175, 55, 0.1);
                    color: var(--gold-400);
                }

                .demo-stats {
                    margin-top: auto;
                    padding-top: 24px;
                    border-top: 1px solid var(--metal-800);
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .demo-stat {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }

                .demo-main {
                    padding: 32px;
                    position: relative;
                }

                .demo-tour {
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
                    border: 1px solid rgba(212, 175, 55, 0.3);
                    border-radius: 12px;
                    padding: 20px 24px;
                    margin-bottom: 24px;
                    position: relative;
                }

                .demo-tour-close {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                }

                .demo-tour p {
                    font-size: 1rem;
                    color: var(--text-cream);
                    margin-bottom: 12px;
                }

                .demo-tour-dots {
                    display: flex;
                    gap: 8px;
                }

                .demo-tour-dots .dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: rgba(212, 175, 55, 0.3);
                }

                .demo-tour-dots .dot.active {
                    background: var(--gold-400);
                }

                .demo-checklist {
                    max-width: 700px;
                }

                .demo-checklist-header {
                    margin-bottom: 24px;
                }

                .demo-checklist-header h2 {
                    font-size: 1.75rem;
                    margin-bottom: 16px;
                }

                .demo-progress {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .demo-progress-bar {
                    flex: 1;
                    height: 8px;
                    background: var(--metal-800);
                    border-radius: 4px;
                    overflow: hidden;
                }

                .demo-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--gold-400), #f59e0b);
                    border-radius: 4px;
                    transition: width 0.5s ease;
                }

                .demo-checklist-items {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .demo-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px 20px;
                    background: var(--metal-900);
                    border: 1px solid var(--metal-800);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .demo-item:hover {
                    border-color: var(--gold-400);
                    transform: translateX(4px);
                }

                .demo-item.done {
                    opacity: 0.6;
                }

                .demo-item.warning {
                    border-color: #ef4444;
                    background: rgba(239, 68, 68, 0.05);
                }

                .demo-checkbox {
                    width: 24px;
                    height: 24px;
                    border: 2px solid var(--metal-600);
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--metal-950);
                    flex-shrink: 0;
                }

                .demo-checkbox.checked {
                    background: var(--gold-400);
                    border-color: var(--gold-400);
                }

                .demo-task {
                    flex: 1;
                    font-size: 0.95rem;
                }

                .demo-ai-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.75rem;
                    color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                    padding: 4px 10px;
                    border-radius: 20px;
                }

                .demo-mic-btn {
                    background: rgba(212, 175, 55, 0.1);
                    border: none;
                    color: var(--gold-400);
                    padding: 8px;
                    border-radius: 6px;
                    cursor: pointer;
                }

                .demo-ai-panel {
                    margin-top: 24px;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(0,0,0,0));
                    border: 1px solid var(--gold-400);
                    border-radius: 12px;
                    padding: 20px;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .demo-ai-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: var(--gold-400);
                    font-weight: 600;
                    margin-bottom: 12px;
                }

                .demo-ai-message {
                    font-family: inherit;
                    font-size: 0.9rem;
                    line-height: 1.6;
                    color: var(--text-cream);
                    white-space: pre-wrap;
                    margin: 0 0 16px 0;
                }

                .demo-ai-action {
                    background: var(--gold-400);
                    color: var(--metal-950);
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .demo-ai-dashboard {
                    max-width: 700px;
                }

                .demo-ai-dashboard h2 {
                    font-size: 1.75rem;
                    margin-bottom: 24px;
                }

                .demo-risk-score {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .demo-score-circle {
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                    background: conic-gradient(
                        #ef4444 calc(var(--score) * 1%),
                        var(--metal-800) 0
                    );
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px;
                    position: relative;
                }

                .demo-score-circle::before {
                    content: '';
                    position: absolute;
                    width: 110px;
                    height: 110px;
                    background: var(--metal-900);
                    border-radius: 50%;
                }

                .demo-score-circle span {
                    position: relative;
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #ef4444;
                }

                .demo-risk-level {
                    font-size: 1.25rem;
                    font-weight: 700;
                }

                .demo-risk-level.high {
                    color: #ef4444;
                }

                .demo-ai-sections {
                    display: grid;
                    gap: 20px;
                }

                .demo-ai-section {
                    background: var(--metal-900);
                    border: 1px solid var(--metal-800);
                    border-radius: 10px;
                    padding: 20px;
                }

                .demo-ai-section h4 {
                    color: var(--gold-400);
                    margin-bottom: 16px;
                    font-size: 1rem;
                }

                .demo-ai-section ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .demo-ai-section li {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }

                .demo-ai-section li svg {
                    color: var(--gold-400);
                    flex-shrink: 0;
                    margin-top: 3px;
                }

                .demo-violation {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 12px;
                    background: rgba(239, 68, 68, 0.05);
                    border-radius: 8px;
                    margin-bottom: 12px;
                }

                .demo-vio-category {
                    font-size: 0.875rem;
                    color: var(--text-cream);
                    min-width: 100px;
                }

                .demo-vio-prob {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .demo-prob-bar {
                    flex: 1;
                    height: 8px;
                    background: var(--metal-800);
                    border-radius: 4px;
                    overflow: hidden;
                }

                .demo-prob-bar div {
                    height: 100%;
                    background: #ef4444;
                    border-radius: 4px;
                }

                .demo-vio-prob span {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    white-space: nowrap;
                }

                .demo-vio-severity {
                    font-size: 0.75rem;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .demo-vio-severity.major {
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                }

                .demo-dashboard {
                    max-width: 800px;
                }

                .demo-dashboard h2 {
                    font-size: 1.75rem;
                    margin-bottom: 24px;
                }

                .demo-metrics {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-bottom: 32px;
                }

                .demo-metric {
                    background: var(--metal-900);
                    border: 1px solid var(--metal-800);
                    border-radius: 12px;
                    padding: 24px;
                    text-align: center;
                }

                .demo-metric-value {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: var(--gold-400);
                    margin-bottom: 8px;
                }

                .demo-metric-label {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }

                .demo-chart-placeholder {
                    background: var(--metal-900);
                    border: 1px solid var(--metal-800);
                    border-radius: 12px;
                    padding: 24px;
                }

                .demo-chart-title {
                    font-size: 1rem;
                    color: var(--text-cream);
                    margin-bottom: 20px;
                }

                .demo-bars {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-around;
                    height: 150px;
                    gap: 20px;
                }

                .demo-bar {
                    flex: 1;
                    max-width: 60px;
                    background: var(--metal-800);
                    border-radius: 6px 6px 0 0;
                    position: relative;
                    overflow: hidden;
                }

                .demo-bar-fill {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    top: 0;
                    background: linear-gradient(180deg, var(--gold-400), rgba(212, 175, 55, 0.3));
                    border-radius: 6px 6px 0 0;
                }

                .demo-floating-cta {
                    position: fixed;
                    bottom: 24px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--metal-900);
                    border: 1px solid var(--gold-400);
                    border-radius: 50px;
                    padding: 16px 32px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                    z-index: 90;
                }

                .demo-cta-content {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                }

                .demo-cta-content p {
                    font-size: 1rem;
                    color: var(--text-cream);
                }

                .demo-cta-button {
                    background: var(--gold-400);
                    color: var(--metal-950);
                    padding: 12px 24px;
                    border-radius: 25px;
                    font-weight: 600;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                }

                .demo-cta-button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
                }

                @media (max-width: 1024px) {
                    .demo-layout {
                        grid-template-columns: 1fr;
                    }
                    .demo-sidebar {
                        display: none;
                    }
                    .demo-metrics {
                        grid-template-columns: 1fr;
                    }
                    .demo-floating-cta {
                        left: 16px;
                        right: 16px;
                        transform: none;
                    }
                    .demo-cta-content {
                        flex-direction: column;
                        gap: 12px;
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
}
