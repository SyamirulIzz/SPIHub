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
