import { useState } from 'react';
import {
    Fish,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Plus,
    MapPin,
    Calendar,
    X,
} from 'lucide-react';
import { format } from 'date-fns';
import { demoSeafoodLabels } from '../data/demo';
import type { SeafoodLabel } from '../types';

export default function SeafoodPage() {
    const [items] = useState<SeafoodLabel[]>(demoSeafoodLabels);
    const [showAdd, setShowAdd] = useState(false);

    const importedCount = items.filter((i) => i.isImported).length;
    const missingSignage = items.filter((i) => i.isImported && !i.signagePosted);

    return (
        <div>
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1>Seafood Labeling</h1>
                        <p>Louisiana seafood origin tracking — avoid $500+ labeling fines</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                        <Plus size={16} /> Add Item
                    </button>
                </div>
            </div>

            {/* Alert Banner */}
            {missingSignage.length > 0 && (
                <div
                    style={{
                        background: 'rgba(251,113,133,0.1)',
                        border: '1px solid rgba(251,113,133,0.25)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 20px',
                        marginBottom: 24,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <AlertTriangle size={20} color="#fb7185" />
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fb7185' }}>
                            ⚠️ Missing Required Signage
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                            {missingSignage.length} imported seafood item(s) need "Country of Origin"
                            signage posted. Louisiana cited 900+ venues in 2025 for this violation.
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-3" style={{ marginBottom: 24 }}>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>
                        <Fish size={20} />
                    </div>
                    <div className="stat-value">{items.length}</div>
                    <div className="stat-label">Total Items</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                        <MapPin size={20} />
                    </div>
                    <div className="stat-value">{importedCount}</div>
                    <div className="stat-label">Imported</div>
                </div>
                <div className="stat-card">
                    <div
                        className="stat-icon"
                        style={{
                            background: missingSignage.length > 0 ? 'rgba(251,113,133,0.15)' : 'rgba(52,211,153,0.15)',
                            color: missingSignage.length > 0 ? '#fb7185' : '#34d399',
                        }}
                    >
                        {missingSignage.length > 0 ? <XCircle size={20} /> : <CheckCircle size={20} />}
                    </div>
                    <div className="stat-value">{missingSignage.length}</div>
                    <div className="stat-label">Missing Signage</div>
                </div>
            </div>

            {/* Items Table */}
            <div className="card" style={{ padding: 0 }}>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Origin</th>
                                <th>Imported?</th>
                                <th>Signage Posted</th>
                                <th>Last Verified</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <Fish size={16} color="var(--accent-sky)" />
                                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                {item.itemName}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} color="var(--text-muted)" />
                                            {item.origin || '—'}
                                        </div>
                                    </td>
                                    <td>
                                        {item.isImported ? (
                                            <span className="badge badge-pending">Yes</span>
                                        ) : (
                                            <span className="badge badge-pass">Domestic</span>
                                        )}
                                    </td>
                                    <td>
                                        {item.signagePosted ? (
                                            <span className="badge badge-pass">
                                                <CheckCircle size={12} /> Posted
                                            </span>
                                        ) : (
                                            <span className="badge badge-fail">
                                                <XCircle size={12} /> Missing
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} color="var(--text-muted)" />
                                            {format(item.lastVerified, 'MMM d, yyyy')}
                                        </div>
                                    </td>
                                    <td>
                                        {!item.isImported || item.signagePosted ? (
                                            <span className="badge badge-pass">Compliant</span>
                                        ) : (
                                            <span className="badge badge-fail">Non-Compliant</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Item Modal */}
            {showAdd && (
                <div className="modal-overlay" onClick={() => setShowAdd(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add Seafood Item</h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowAdd(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Item Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Gulf Shrimp (16/20)"
                                id="seafood-name"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Is this imported?</label>
                            <select className="form-input form-select" id="seafood-imported">
                                <option value="no">No — Domestic</option>
                                <option value="yes">Yes — Imported</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Country/Region of Origin</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Louisiana, USA or China"
                                id="seafood-origin"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Signage Posted?</label>
                            <select className="form-input form-select" id="seafood-signage">
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                        <button className="btn btn-primary w-full" onClick={() => setShowAdd(false)}>
                            <Plus size={16} /> Add Seafood Item
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
