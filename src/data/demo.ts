// ========================================
// Demo Data — Realistic ComplianceDaddy Data (RESET TO ZERO)
// ========================================

import type {
    Checklist,
    StaffCertification,
    InspectionLog,
    Incident,
    DashboardStats,
    SeafoodLabel,
} from '../types';

// ── Dashboard Stats (Starting at Zero) ───────
export const demoStats: DashboardStats = {
    totalInspections: 0,
    passRate: 0,
    pendingTasks: 4,
    expiringCerts: 0,
    openIncidents: 0,
    complianceScore: 0,
};

// ── Checklists (Templates reset to Pending) ──
export const demoChecklists: Checklist[] = [
    {
        id: 'cl-001',
        venueId: 'venue-001',
        title: 'Daily Pre-Opening Health Check',
        category: 'health',
        type: 'pre_opening',
        status: 'pending',
        createdAt: new Date(),
        items: [
            { id: 'i1', task: 'Walk-in cooler temperature ≤ 41°F', isDone: false },
            { id: 'i2', task: 'Line cooler temperature ≤ 41°F', isDone: false },
            { id: 'i3', task: 'Dishmachine sanitizer concentration (50-100ppm)', isDone: false },
            { id: 'i4', task: 'Hand sinks stocked: soap, paper towels, warm water', isDone: false },
            { id: 'i5', task: 'Prep surfaces sanitized and clear', isDone: false },
            { id: 'i6', task: 'Food labels checked: date marks current', isDone: false },
            { id: 'i7', task: 'Employee illness/injury log reviewed', isDone: false },
            { id: 'i8', task: 'Pest activity inspection — no signs', isDone: false },
        ],
    },
    {
        id: 'cl-002',
        venueId: 'venue-001',
        title: 'Bar Setup — Alcohol Compliance',
        category: 'alcohol',
        type: 'pre_opening',
        status: 'pending',
        createdAt: new Date(),
        items: [
            { id: 'a1', task: 'Verify all bartenders have valid RVP/ServSafe Alcohol', isDone: false },
            { id: 'a2', task: 'ID scanner / check station operational', isDone: false },
            { id: 'a3', task: 'Cut-off log book in position', isDone: false },
            { id: 'a4', task: 'Signage posted: "We ID Everyone Under 30"', isDone: false },
            { id: 'a5', task: 'Liquor license posted and visible', isDone: false },
            { id: 'a6', task: 'Over-serve awareness briefing completed', isDone: false },
        ],
    },
    {
        id: 'cl-003',
        venueId: 'venue-001',
        title: 'Fire & Safety Walkthrough',
        category: 'fire',
        type: 'shift',
        status: 'pending',
        createdAt: new Date(),
        items: [
            { id: 'f1', task: 'All emergency exits unlocked & unobstructed', isDone: false },
            { id: 'f2', task: 'Exit signs illuminated', isDone: false },
            { id: 'f3', task: 'Fire extinguisher pressure in green zone', isDone: false },
            { id: 'f4', task: 'Grease trap cleaned and logged', isDone: false },
            { id: 'f5', task: 'Hood suppression system inspection tag current', isDone: false },
            { id: 'f6', task: 'First aid kit fully stocked', isDone: false },
        ],
    },
    {
        id: 'cl-004',
        venueId: 'venue-001',
        title: 'Nightly Closing Checklist',
        category: 'general',
        type: 'closing',
        status: 'pending',
        createdAt: new Date(),
        items: [
            { id: 'g1', task: 'All POS terminals closed out', isDone: false },
            { id: 'g2', task: 'Walk-in and reach-in temps logged', isDone: false },
            { id: 'g3', task: 'Floors swept and mopped — no standing water', isDone: false },
            { id: 'g4', task: 'Trash removed — no overflow', isDone: false },
            { id: 'g5', task: 'All doors and windows secured', isDone: false },
        ],
    },
];

// ── Staff Certifications (Empty) ──────────────
export const demoCertifications: StaffCertification[] = [];

// ── Inspection Logs (Empty) ───────────────────
export const demoInspectionLogs: InspectionLog[] = [];

// ── Incidents (Empty) ─────────────────────────
export const demoIncidents: Incident[] = [];

// ── Seafood Labels (Empty) ────────────────────
export const demoSeafoodLabels: SeafoodLabel[] = [];
