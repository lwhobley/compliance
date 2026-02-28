import React from 'react';

interface SkeletonCardProps {
    lines?: number;
    hasHeader?: boolean;
    hasProgress?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
    lines = 3,
    hasHeader = true,
    hasProgress = false
}) => {
    return (
        <div className="skeleton-card" style={{ padding: '24px' }}>
            {hasHeader && (
                <div className="flex items-center gap-3 mb-4">
                    <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)' }} />
                    <div className="skeleton" style={{ width: 120, height: 20, borderRadius: 'var(--radius-sm)' }} />
                </div>
            )}

            {hasProgress && (
                <div className="skeleton" style={{ width: '100%', height: 8, borderRadius: 4, marginBottom: 16 }} />
            )}

            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="skeleton"
                    style={{
                        width: i === lines - 1 ? '80%' : '100%',
                        height: 16,
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: 12
                    }}
                />
            ))}
        </div>
    );
};

interface SkeletonTableProps {
    rows?: number;
    columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({ rows = 5, columns = 4 }) => {
    return (
        <div className="skeleton-card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header */}
            <div className="flex gap-4 p-4" style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-default)' }}>
                {Array.from({ length: columns }).map((_, i) => (
                    <div
                        key={i}
                        className="skeleton"
                        style={{ flex: 1, height: 16, borderRadius: 'var(--radius-sm)' }}
                    />
                ))}
            </div>

            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div
                    key={rowIndex}
                    className="flex gap-4 p-4"
                    style={{
                        borderBottom: rowIndex < rows - 1 ? '1px solid var(--border-default)' : 'none'
                    }}
                >
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className="skeleton"
                            style={{
                                flex: 1,
                                height: 16,
                                borderRadius: 'var(--radius-sm)',
                                opacity: colIndex === 0 ? 1 : 0.6
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export const SkeletonStatCard: React.FC = () => {
    return (
        <div className="skeleton-card stat-card">
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', marginBottom: 14 }} />
            <div className="skeleton" style={{ width: 80, height: 32, borderRadius: 'var(--radius-sm)', marginBottom: 8 }} />
            <div className="skeleton" style={{ width: 100, height: 16, borderRadius: 'var(--radius-sm)' }} />
        </div>
    );
};

interface SkeletonDashboardProps {
    showHeader?: boolean;
}

export const SkeletonDashboard: React.FC<SkeletonDashboardProps> = ({ showHeader = true }) => {
    return (
        <div className="animate-enter">
            {showHeader && (
                <div className="page-header">
                    <div className="skeleton" style={{ width: 300, height: 32, borderRadius: 'var(--radius-sm)', marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: 250, height: 16, borderRadius: 'var(--radius-sm)' }} />
                </div>
            )}

            {/* Top row */}
            <div className="grid grid-3 gap-6" style={{ marginBottom: 28 }}>
                <SkeletonCard lines={4} hasProgress />
                <SkeletonCard lines={3} hasHeader={false} />
                <SkeletonCard lines={2} />
            </div>

            {/* Bottom row */}
            <div className="grid grid-3 gap-6">
                <SkeletonCard lines={5} />
                <SkeletonCard lines={4} hasProgress />
                <SkeletonCard lines={4} />
            </div>
        </div>
    );
};

export const SkeletonChecklist: React.FC = () => {
    return (
        <div className="animate-enter">
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="skeleton" style={{ width: 200, height: 32, borderRadius: 'var(--radius-sm)', marginBottom: 8 }} />
                        <div className="skeleton" style={{ width: 300, height: 16, borderRadius: 'var(--radius-sm)' }} />
                    </div>
                    <div className="skeleton" style={{ width: 120, height: 40, borderRadius: 'var(--radius-md)' }} />
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs" style={{ marginBottom: 24 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="skeleton"
                        style={{ width: 80, height: 32, borderRadius: 'var(--radius-sm)' }}
                    />
                ))}
            </div>

            {/* Checklist cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonCard key={i} lines={0} hasHeader hasProgress />
                ))}
            </div>
        </div>
    );
};

export default {
    Card: SkeletonCard,
    Table: SkeletonTable,
    StatCard: SkeletonStatCard,
    Dashboard: SkeletonDashboard,
    Checklist: SkeletonChecklist,
};
