import { User, Department, Project, StaffMovement, LeaveRequest, ProjectTicket, ReimbursementClaim } from './types';

export const DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Software Engineering' },
  { id: 'dept-2', name: 'Operations & Logistics' },
  { id: 'dept-3', name: 'Management' },
];

export const PROJECTS: Project[] = [
  { id: 'proj-1', name: 'Projek AADK', description: 'National Anti-Drugs Agency System Upgrade', status: 'ACTIVE' },
  { id: 'proj-2', name: 'SPI Internal Portal', description: 'Internal operations hub', status: 'ACTIVE' },
  { id: 'proj-3', name: 'Cloud Migration', description: 'Legacy server migration', status: 'ON_HOLD' },
];

export const USERS: User[] = [
  { 
    id: 'user-1', 
    name: 'Ahmad Manager', 
    email: 'ahmad@systemprotocol.com', 
    role: 'ADMIN', 
    departmentId: 'dept-3',
    position: 'CEO / Management',
    annualLeaveLimit: 25,
    medicalClaimLimit: 2000
  },
  { 
    id: 'user-2', 
    name: 'Siti HOD', 
    email: 'siti@systemprotocol.com', 
    role: 'HOD', 
    departmentId: 'dept-1',
    position: 'Head of Engineering',
    annualLeaveLimit: 20,
    medicalClaimLimit: 1500
  },
  { 
    id: 'user-3', 
    name: 'Musa Staff', 
    email: 'musa@systemprotocol.com', 
    role: 'STAFF', 
    departmentId: 'dept-1',
    position: 'Senior Developer',
    annualLeaveLimit: 14,
    medicalClaimLimit: 1000
  },
  { 
    id: 'user-4', 
    name: 'Zul Logistic', 
    email: 'zul@systemprotocol.com', 
    role: 'STAFF', 
    departmentId: 'dept-2',
    position: 'Operations Officer',
    annualLeaveLimit: 14,
    medicalClaimLimit: 1000
  },
];

export const MOVEMENTS: StaffMovement[] = [
  {
    id: 'mov-1',
    userId: 'user-3',
    projectId: 'proj-1',
    startDate: '2024-05-15T09:00:00',
    endDate: '2024-05-15T17:00:00',
    allDay: false,
    destination: 'AADK HQ, Kajang',
    purpose: 'System Deployment',
    description: 'Deploying version 2.1 to production servers.',
    category: 'SITE_VISIT',
    contactPerson: 'En. Ibrahim',
    contactOrg: 'AADK',
    transportation: 'CAR',
    claimable: true,
    movementType: 'OUT',
    status: 'COMPLETED'
  },
  {
    id: 'mov-2',
    userId: 'user-4',
    projectId: 'proj-1',
    startDate: '2024-05-16T10:00:00',
    endDate: '2024-05-16T14:00:00',
    allDay: false,
    destination: 'Klang Valley Logistics Hub',
    purpose: 'Hardware Pickup',
    description: 'Picking up server racks for Project AADK.',
    category: 'LOGISTIC',
    contactPerson: 'Lily',
    contactOrg: 'LogiShip Sdn Bhd',
    transportation: 'MOTORCYCLE',
    claimable: true,
    movementType: 'OUT',
    status: 'PENDING'
  }
];

export const LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-1',
    userId: 'user-3',
    leaveType: 'ANNUAL',
    startDate: '2024-06-01',
    endDate: '2024-06-03',
    reason: 'Family Vacation',
    status: 'APPROVED'
  },
  {
    id: 'leave-2',
    userId: 'user-4',
    leaveType: 'MEDICAL',
    startDate: '2024-05-20',
    endDate: '2024-05-20',
    reason: 'Fever and cold',
    status: 'PENDING'
  }
];

export const TICKETS: ProjectTicket[] = [
  {
    id: 'tick-1',
    projectId: 'proj-1',
    createdBy: 'user-3',
    assignedTo: 'user-2',
    subject: 'Login Timeout Issue',
    description: 'Users reporting frequent session timeouts in the AADK portal.',
    severity: 'High',
    status: 'In Progress',
    createdAt: '2024-05-10T11:20:00'
  },
  {
    id: 'tick-2',
    projectId: 'proj-1',
    createdBy: 'user-4',
    assignedTo: 'user-3',
    subject: 'Broken Image on Dashboard',
    description: 'Banner image is not loading on mobile views.',
    severity: 'Low',
    status: 'Open',
    createdAt: '2024-05-12T09:45:00'
  }
];

export const CLAIMS: ReimbursementClaim[] = [
  {
    id: 'claim-1',
    userId: 'user-3',
    date: '2024-05-01',
    amount: 85.50,
    category: 'MEDICAL',
    description: 'Poliklinik Appointment',
    receiptUrl: 'https://picsum.photos/seed/claim1/600/800',
    status: 'APPROVED'
  },
  {
    id: 'claim-2',
    userId: 'user-4',
    date: '2024-05-14',
    amount: 120.00,
    category: 'GENERAL',
    description: 'Parking & Toll reimbursement for AADK trip',
    receiptUrl: 'https://picsum.photos/seed/claim2/600/800',
    status: 'PENDING'
  }
];

// Current session simulation
export const CURRENT_USER = USERS[0]; // Let's simulate being the Admin (Ahmad Manager)