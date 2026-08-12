export const ROLE_PREVIEWS = [
  {
    id: 'super-admin',
    roleName: 'Super Admin',
    badge: 'Platform Control',
    tagline: 'Complete portfolio oversight and platform governance.',
    description: 'Centralized control center for executive teams managing multiple companies, regional offices, global settings, and user access levels.',
    features: [
      'Company Growth Prediction',
      'Revenue Forecast Models',
      'Subscription Insights',
      'Global AI Analytics & Cross-Portfolio KPIs',
      'Role & Permission System (RBAC)'
    ],
    mockupData: {
      title: 'Super Admin Governance Overview',
      stat1: { label: 'Total Companies', value: '24 Entities' },
      stat2: { label: 'Active Units', value: '14,850 Units' },
      stat3: { label: 'Monthly Revenue', value: '$3.42M' },
      stat4: { label: 'Platform Health', value: '99.98%' }
    }
  },
  {
    id: 'manager',
    roleName: 'Manager',
    badge: 'Daily Operations',
    tagline: 'Operational command center for day-to-day property tasks.',
    description: 'Designed specifically for property managers to track vacancies, monitor rent collection ledgers, resolve maintenance tickets, and handle lease renewals.',
    features: [
      'AI Occupancy Forecast',
      'Predictive Maintenance Alerts',
      'Smart Vendor Suggestions',
      'Real-Time Cash Flow & Rent Ledger',
      'Automated Late Fee & Notice Engine'
    ],
    mockupData: {
      title: 'Manager Operations Hub',
      stat1: { label: 'Occupancy Rate', value: '96.4%' },
      stat2: { label: 'Collected Rent', value: '$482,500' },
      stat3: { label: 'Open Work Orders', value: '8 Active' },
      stat4: { label: 'Lease Renewals Due', value: '12 Next 30 Days' }
    }
  },
  {
    id: 'owner-portal',
    roleName: 'Owner Portal',
    badge: 'Investor Visibility',
    tagline: 'Transparent financial insights and statements for owners.',
    description: 'Dedicated portal for real estate investors and property owners to view performance dashboards, download 1099 tax forms, and track distribution payouts.',
    features: [
      'AI-Powered ROI Forecast',
      'Property Performance Benchmarking',
      'Income Projection & Cash Flow Models',
      'Automated Monthly Owner Statements',
      'Direct ACH Distribution Payout History'
    ],
    mockupData: {
      title: 'Property Owner Financial Performance',
      stat1: { label: 'Net Distribution', value: '$124,800' },
      stat2: { label: 'Operating Margin', value: '68.5%' },
      stat3: { label: 'YTD NOI', value: '$842,000' },
      stat4: { label: 'Owner Statement', value: 'Ready (June)' }
    }
  },
  {
    id: 'tenant-portal',
    roleName: 'Tenant Portal',
    badge: 'Resident Self-Service',
    tagline: 'Convenient mobile app experience for payments and requests.',
    description: 'Mobile-first portal for residents to make instant rent payments, enroll in autopay, log maintenance tickets with photos, and view lease agreements.',
    features: [
      'AI Maintenance Assistant (Triage)',
      'Smart Rent & Autopay Reminders',
      'AI-Generated Lease Summary',
      'Two-Way Property Communication',
      'Rent Payment History & Receipts'
    ],
    mockupData: {
      title: 'Resident Self-Service Dashboard',
      stat1: { label: 'Next Rent Due', value: '$1,850 (1st)' },
      stat2: { label: 'Payment Status', value: 'Autopay Active' },
      stat3: { label: 'Maintenance Ticket', value: '#402 In Progress' },
      stat4: { label: 'Lease Status', value: 'Active (Expires May 2027)' }
    }
  },
  {
    id: 'maintenance-staff',
    roleName: 'Maintenance Staff',
    badge: 'Field Repairs',
    tagline: 'Real-time work orders and technician dispatch center.',
    description: 'Empowers field maintenance technicians and vendors to receive work orders, upload repair photos, order HVAC/plumbing parts, and log labor hours.',
    features: [
      'Work Order Priority Queue',
      'Photo Upload & Repair Proof',
      'Vendor Dispatch System',
      'Parts & Inventory Tracking',
      'Automated Tenant Notification'
    ],
    mockupData: {
      title: 'Field Maintenance Dispatch Center',
      stat1: { label: 'Active Work Orders', value: '84 Pending' },
      stat2: { label: 'Avg Resolution Time', value: '1.4 Days' },
      stat3: { label: 'HVAC Alert Priority', value: 'Urgent (Unit 304)' },
      stat4: { label: 'Vendor Status', value: 'Dispatch Ready' }
    }
  },
  {
    id: 'collection-manager',
    roleName: 'Collection Manager',
    badge: 'Financial Collections',
    tagline: 'Automated rent collection, late fee tracking, and ledger audits.',
    description: 'Specialized ledger dashboard for collection officers to track overdue balances, send 3-day notices, reconcile bank ACH deposits, and manage late fees.',
    features: [
      'Overdue Balance Tracker',
      'Automated 3-Day Notice Engine',
      'ACH & Card Payment Reconciliation',
      'Late Fee Calculation System',
      'Delinquency Risk Analytics'
    ],
    mockupData: {
      title: 'Collection & Delinquency Management',
      stat1: { label: 'Total Collections', value: '$246,000' },
      stat2: { label: 'Overdue Balance', value: '$8,400' },
      stat3: { label: 'Late Notice Sent', value: '14 Tenants' },
      stat4: { label: 'Collection Rate', value: '98.2%' }
    }
  }
];
