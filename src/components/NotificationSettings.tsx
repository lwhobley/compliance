// ========================================
// Notification Settings Component
// Allow users to enable/disable push notifications
// ========================================

import { useState } from 'react';
import { Bell, BellOff, Check, AlertCircle, Loader2 } from 'lucide-react';
import { usePushNotifications } from '../hooks/usePushNotifications';

export default function NotificationSettings() {
    const {
        permission,
        isSubscribed,
        isLoading,
        error,
        requestPermission,
        unsubscribe,
        isSupported
    } = usePushNotifications();

    const [showSuccess, setShowSuccess] = useState(false);

    const handleEnable = async () => {
        const success = await requestPermission();
        if (success) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    const handleDisable = async () => {
        const success = await unsubscribe();
        if (success) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    if (!isSupported) {
        return (
            <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                    <BellOff size={24} />
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>Notifications Not Supported</h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem' }}>
                            Your browser doesn't support push notifications. Try using Chrome or Edge.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: isSubscribed ? 'rgba(52,211,153,0.15)' : 'rgba(107,114,128,0.15)',
                            color: isSubscribed ? '#34d399' : '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {isSubscribed ? <Bell size={24} /> : <BellOff size={24} />}
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                            Push Notifications
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            {isSubscribed
                                ? 'You\'ll receive alerts for expiring certifications, incidents, and compliance reminders'
                                : 'Enable notifications to get alerts for expiring certifications and compliance issues'
                            }
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    {isSubscribed ? (
                        <button
                            onClick={handleDisable}
                            disabled={isLoading}
                            className="btn btn-ghost"
                            style={{
                                color: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <BellOff size={16} />
                            )}
                            Disable
                        </button>
                    ) : (
                        <button
                            onClick={handleEnable}
                            disabled={isLoading || permission === 'denied'}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Bell size={16} />
                            )}
                            Enable Notifications
                        </button>
                    )}
                </div>
            </div>

            {/* Status messages */}
            {permission === 'denied' && (
                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'rgba(239,68,68,0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(239,68,68,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#ef4444',
                    fontSize: '0.875rem'
                }}>
                    <AlertCircle size={16} />
                    Notifications are blocked. Please enable them in your browser settings.
                </div>
            )}

            {error && (
                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'rgba(239,68,68,0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(239,68,68,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#ef4444',
                    fontSize: '0.875rem'
                }}>
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {showSuccess && (
                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'rgba(52,211,153,0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(52,211,153,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#34d399',
                    fontSize: '0.875rem'
                }}>
                    <Check size={16} />
                    {isSubscribed ? 'Notifications enabled successfully!' : 'Notifications disabled.'}
                </div>
            )}

            {/* Notification types */}
            {isSubscribed && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        You\'ll be notified about:
                    </h4>
                    <ul style={{
                        margin: 0,
                        padding: 0,
                        listStyle: 'none',
                        display: 'grid',
                        gap: '8px'
                    }}>
                        {[
                            'Certifications expiring within 30 days',
                            'New incidents reported',
                            'Inspection deadlines',
                            'Compliance score changes',
                            'AI-detected violations'
                        ].map((item, i) => (
                            <li
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)'
                                }}
                            >
                                <div style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: '#34d399'
                                }} />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}