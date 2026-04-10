// Role definitions
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  RECEPTION: 'reception',
  RESIDENT: 'resident',
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.RECEPTION]: 'Reception',
  [ROLES.RESIDENT]: 'Resident',
};

export const ROLE_COLORS = {
  [ROLES.SUPER_ADMIN]: 'info',
  [ROLES.ADMIN]: 'accent',
  [ROLES.MANAGER]: 'warning',
  [ROLES.RECEPTION]: 'neutral',
  [ROLES.RESIDENT]: 'success',
};

// Complaint statuses
export const COMPLAINT_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

export const COMPLAINT_STATUS_LABELS = {
  [COMPLAINT_STATUS.OPEN]: 'Open',
  [COMPLAINT_STATUS.IN_PROGRESS]: 'In Progress',
  [COMPLAINT_STATUS.RESOLVED]: 'Resolved',
  [COMPLAINT_STATUS.CLOSED]: 'Closed',
};

export const COMPLAINT_STATUS_COLORS = {
  [COMPLAINT_STATUS.OPEN]: 'danger',
  [COMPLAINT_STATUS.IN_PROGRESS]: 'warning',
  [COMPLAINT_STATUS.RESOLVED]: 'success',
  [COMPLAINT_STATUS.CLOSED]: 'neutral',
};

// Complaint priorities
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const PRIORITY_LABELS = {
  [PRIORITY.LOW]: 'Low',
  [PRIORITY.MEDIUM]: 'Medium',
  [PRIORITY.HIGH]: 'High',
  [PRIORITY.URGENT]: 'Urgent',
};

export const PRIORITY_COLORS = {
  [PRIORITY.LOW]: 'neutral',
  [PRIORITY.MEDIUM]: 'info',
  [PRIORITY.HIGH]: 'warning',
  [PRIORITY.URGENT]: 'danger',
};

// Payment statuses
export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue',
  PARTIAL: 'partial',
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PAID]: 'Paid',
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.OVERDUE]: 'Overdue',
  [PAYMENT_STATUS.PARTIAL]: 'Partial',
};

export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.PAID]: 'success',
  [PAYMENT_STATUS.PENDING]: 'warning',
  [PAYMENT_STATUS.OVERDUE]: 'danger',
  [PAYMENT_STATUS.PARTIAL]: 'info',
};

// Notice categories
export const NOTICE_CATEGORY = {
  URGENT: 'urgent',
  GENERAL: 'general',
  EVENT: 'event',
  MAINTENANCE: 'maintenance',
};

export const NOTICE_CATEGORY_LABELS = {
  [NOTICE_CATEGORY.URGENT]: 'Urgent',
  [NOTICE_CATEGORY.GENERAL]: 'General',
  [NOTICE_CATEGORY.EVENT]: 'Event',
  [NOTICE_CATEGORY.MAINTENANCE]: 'Maintenance',
};

export const NOTICE_CATEGORY_COLORS = {
  [NOTICE_CATEGORY.URGENT]: 'danger',
  [NOTICE_CATEGORY.GENERAL]: 'info',
  [NOTICE_CATEGORY.EVENT]: 'accent',
  [NOTICE_CATEGORY.MAINTENANCE]: 'warning',
};

// Visitor types
export const VISITOR_TYPE = {
  VISITOR: 'visitor',
  DELIVERY: 'delivery',
  CAB: 'cab',
  SERVICE: 'service',
};

export const VISITOR_STATUS = {
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
  EXPECTED: 'expected',
};

// Demo accounts
export const DEMO_ACCOUNTS = [
  {
    id: 'u1',
    email: 'superadmin@abode.com',
    password: 'demo123',
    name: 'Rajesh Kumar',
    role: ROLES.SUPER_ADMIN,
    apartment_id: null,
    avatar: null,
  },
  {
    id: 'u2',
    email: 'admin@abode.com',
    password: 'demo123',
    name: 'Priya Sharma',
    role: ROLES.ADMIN,
    apartment_id: 'apt1',
    avatar: null,
  },
  {
    id: 'u3',
    email: 'resident@abode.com',
    password: 'demo123',
    name: 'Amit Patel',
    role: ROLES.RESIDENT,
    apartment_id: 'apt1',
    flat_id: 'f1',
    avatar: null,
  },
];
