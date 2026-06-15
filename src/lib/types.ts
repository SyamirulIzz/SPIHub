
export type UserRole = 'ADMIN' | 'HOD' | 'STAFF';

export interface Department {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  position: string;
  annualLeaveLimit: number;
  medicalClaimLimit: number;
  salary?: number;
  carriedForward?: number;
  additionalLeave?: number;
  unpaidLeave?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
}

export interface StaffMovement {
  id: string;
  userId: string;
  projectId: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  destination: string;
  purpose: string;
  description: string;
  category: 'LOGISTIC' | 'OUTSTATION' | 'CLIENT_MEETING' | 'SITE_VISIT';
  contactPerson: string;
  contactOrg: string;
  transportation: 'CAR' | 'MOTORCYCLE' | 'PUBLIC_TRANSPORT';
  claimable: boolean;
  movementType: 'OUT' | 'IN';
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED' | 'APPROVED';
  approvedBy?: string;
  evidenceUrl?: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  leaveType: 'ANNUAL' | 'MEDICAL' | 'EMERGENCY' | 'UNPAID';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  mcUrl?: string;
}

export interface ProjectTicket {
  id: string;
  projectId: string;
  createdBy: string;
  assignedTo?: string;
  subject: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  attachmentUrl?: string;
}

export interface ReimbursementClaim {
  id: string;
  userId: string;
  date: string;
  amount: number;
  category: 'MEDICAL' | 'GENERAL' | 'TRAVEL';
  description: string;
  receiptUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// New Asset Management Types
export type AssetCategory = 'CAPITAL' | 'LOW_VALUE'; // KEW.PA-3 vs KEW.PA-4
export type AssetStatus = 'GOOD' | 'DAMAGED' | 'DISPOSED' | 'LOST';

export interface Asset {
  id: string;
  refNo: string; // Serial/Asset ID (e.g. SPI/HOD/2024/001)
  name: string;
  model: string;
  category: AssetCategory;
  price: number;
  purchaseDate: string;
  location: string;
  description?: string; // New field for detailed check
  projectId?: string; // Linked to project site
  status: AssetStatus;
  currentHolderId?: string; // Who is using it
}

export interface AssetMovement {
  id: string;
  assetId: string;
  userId: string;
  projectId: string;
  checkoutDate: string;
  expectedReturnDate: string;
  returnDate?: string;
  purpose: string;
  status: 'OUT' | 'RETURNED';
}

export interface AssetDamageReport {
  id: string;
  assetId: string;
  reportedById: string;
  damageDate: string;
  description: string;
  status: 'PENDING' | 'REPAIRING' | 'RESOLVED';
}
