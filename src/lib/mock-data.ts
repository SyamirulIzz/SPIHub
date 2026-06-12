import { User, Department, Project, StaffMovement, LeaveRequest, ProjectTicket, ReimbursementClaim } from './types';

export const DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Software Engineering' },
  { id: 'dept-2', name: 'Operations & Logistics' },
  { id: 'dept-3', name: 'Management' },
  { id: 'dept-4', name: 'Human Resources' },
  { id: 'dept-5', name: 'Finance' },
];

export const PROJECTS: Project[] = [
  { id: 'proj-1', name: 'Projek AADK', description: 'National Anti-Drugs Agency System Upgrade', status: 'ACTIVE' },
  { id: 'proj-2', name: 'SPI Internal Portal', description: 'Internal operations hub', status: 'ACTIVE' },
  { id: 'proj-4', name: 'Smart City API', description: 'Integration with municipal data', status: 'ACTIVE' },
  { id: 'proj-6', name: 'Mobile Attendance', description: 'Geofencing attendance app', status: 'ACTIVE' },
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
  { 
    id: 'user-6', 
    name: 'Lim Frontend', 
    email: 'lim@systemprotocol.com', 
    role: 'STAFF', 
    departmentId: 'dept-1',
    position: 'Frontend Engineer',
    annualLeaveLimit: 14,
    medicalClaimLimit: 1000
  },
  { 
    id: 'user-7', 
    name: 'Devi Backend', 
    email: 'devi@systemprotocol.com', 
    role: 'STAFF', 
    departmentId: 'dept-1',
    position: 'Backend Specialist',
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
    status: 'COMPLETED',
    approvedBy: 'Ahmad Manager',
    evidenceUrl: 'https://picsum.photos/seed/mov1/800/600'
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
  },
  {
    id: 'mov-3',
    userId: 'user-6',
    projectId: 'proj-4',
    startDate: '2024-05-17T14:00:00',
    endDate: '2024-05-17T16:00:00',
    allDay: false,
    destination: 'Cyberjaya Council',
    purpose: 'Requirement Gathering',
    description: 'Meeting with UI/UX stakeholders.',
    category: 'CLIENT_MEETING',
    contactPerson: 'Mr. Tan',
    contactOrg: 'MBSJ',
    transportation: 'CAR',
    claimable: true,
    movementType: 'OUT',
    status: 'APPROVED',
    approvedBy: 'Siti HOD',
    evidenceUrl: 'https://picsum.photos/seed/mov3/800/600'
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
    status: 'PENDING',
    mcUrl: 'https://picsum.photos/seed/mc2/600/800'
  },
  {
    id: 'leave-5',
    userId: 'user-3',
    leaveType: 'MEDICAL',
    startDate: '2024-05-12',
    endDate: '2024-05-13',
    reason: 'Dental surgery',
    status: 'APPROVED',
    mcUrl: 'https://picsum.photos/seed/mc5/600/800'
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
    id: 'tick-3',
    projectId: 'proj-4',
    createdBy: 'user-6',
    assignedTo: 'user-7',
    subject: 'API Authentication Failure',
    description: 'Integration layer returning 401 for valid tokens.',
    severity: 'High',
    status: 'Open',
    createdAt: '2024-05-14T15:30:00'
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
  },
  {
    id: 'claim-3',
    userId: 'user-6',
    date: '2024-05-10',
    amount: 45.00,
    category: 'TRAVEL',
    description: 'Grab to Client Meeting (MBSJ)',
    receiptUrl: 'https://picsum.photos/seed/claim3/600/800',
    status: 'APPROVED'
  }
];

export const CURRENT_USER = USERS[0];
