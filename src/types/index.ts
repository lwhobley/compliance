// ========================================
// ComplianceDaddy Type Definitions
// ========================================

export type UserRole = 'admin' | 'manager' | 'staff';

export type VenueType =
  | 'bar'
  | 'restaurant'
  | 'nightclub'
  | 'hotel'
  | 'brewery'
  | 'food_truck'
  | 'catering'
  | 'cafe'
  | 'other';

export type EmployeeRange = '1-10' | '10-30' | '30-50' | '50+';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  company: string;
  city: string;
  state: string;
  zipcode: string;
  venueType: VenueType;
  employeeRange: EmployeeRange;
  auditState: string; // Auto-assigned from state selection
  role: UserRole;
  venueId: string;
  createdAt: string;
  subscriptionTier: 'free' | 'basic' | 'pro';
  trialEndsAt: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  city: string;
  state: string;
  zipcode: string;
  venueType: VenueType;
  employeeRange: EmployeeRange;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  ownerUid: string;
  createdAt: Date;
  settings: {
    theme: string;
    timezone: string;
  };
}

export type ChecklistCategory = 'health' | 'fire' | 'alcohol' | 'general';
export type ChecklistStatus = 'pending' | 'in_progress' | 'completed';

export interface ChecklistItem {
  id: string;
  task: string;
  isDone: boolean;
  photoUrl?: string;
  note?: string;
  completedBy?: string;
  completedAt?: Date;
}

export interface Checklist {
  id: string;
  venueId: string;
  title: string;
  category: ChecklistCategory;
  type: 'pre_opening' | 'shift' | 'closing';
  status: ChecklistStatus;
  items: ChecklistItem[];
  assignedTo?: string;
  completedBy?: string;
  completedAt?: Date;
  createdAt: Date;
  dueAt?: Date;
}

export type CertificationType = 'ServSafe' | 'RVP' | 'HealthPermit' | 'FoodHandler' | 'TABC' | 'Other';

export interface StaffCertification {
  id: string;
  staffUid: string;
  staffName: string;
  venueId: string;
  type: CertificationType;
  issuedDate: Date;
  expiryDate: Date;
  fileUrl?: string;
  notified: boolean;
}

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Incident {
  id: string;
  venueId: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  reportedBy: string;
  reportedAt: Date;
  photoUrls: string[];
  witnesses: string[];
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface InspectionLog {
  id: string;
  venueId: string;
  category: ChecklistCategory;
  status: 'Pass' | 'Fail' | 'Pending';
  completedBy: string;
  timestamp: Date;
  score: number;
  totalItems: number;
  passedItems: number;
  items: ChecklistItem[];
}

export interface DashboardStats {
  totalInspections: number;
  passRate: number;
  pendingTasks: number;
  expiringCerts: number;
  openIncidents: number;
  complianceScore: number;
}

export interface AIComplianceAnalysis {
  id: string;
  checklistId: string;
  venueId: string;
  analysisDate: Date;
  riskScore: number; // 0-100, higher = more risky
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  predictedViolations: {
    category: ChecklistCategory;
    probability: number; // 0-1
    severity: 'minor' | 'major' | 'critical';
  }[];
  complianceTrends: {
    category: ChecklistCategory;
    trend: 'improving' | 'declining' | 'stable';
    scoreChange: number;
  }[];
  suggestedChecklistUpdates: {
    originalTask: string;
    suggestedTask: string;
    reason: string;
  }[];
}

