export const FEATURES = [
  {
    id: 'property-management',
    iconName: 'Building2',
    title: 'Property & Unit Management',
    shortDesc: 'Organize residential, commercial, HOA, and mixed-use portfolios in one centralized enterprise workspace.',
    fullDesc: 'Manage single-family homes, multi-family apartments, commercial complexes, and industrial sites seamlessly. Gain 360-degree visibility over unit availabilities, lease statuses, property inspections, and square footage utilization.',
    benefits: [
      'Centralized unit inventory and property hierarchy',
      'Customizable unit attributes, floor plans, and amenities',
      'Real-time vacancy tracking and lease cycle monitoring',
      'Automated property inspection schedules & condition reports'
    ],
    tag: 'Core Portfolio',
    isAI: false
  },
  {
    id: 'tenant-management',
    iconName: 'Sparkles',
    title: 'AI Lease & Tenant Screening',
    shortDesc: 'AI-driven tenant background risk scoring, automated lease renewals, e-signatures, and smart rent adjustments.',
    fullDesc: 'Automate tenant onboarding with AI credit risk scoring and background checks. Manage digital lease agreements, track lease expiry dates, and automate lease renewals.',
    benefits: [
      'AI tenant credit screening & risk assessment scoring',
      'Digital lease agreements & e-signature workflows',
      'Automated lease renewal notifications & rent escalations',
      'Centralized tenant profiles & active lease status'
    ],
    tag: 'AI Leasing',
    isAI: true,
    aiTag: 'AI Risk Screening'
  },
  {
    id: 'owner-portal',
    iconName: 'ShieldCheck',
    title: 'Dedicated Owner Portal',
    shortDesc: 'Empower property owners with self-service real-time financial reporting, statements, and disbursements.',
    fullDesc: 'Provide property owners with a transparent, branded portal to access monthly income statements, view distribution histories, review balance sheets, and approve capital expenditures.',
    benefits: [
      'Instant access to monthly owner statements & 1099 tax forms',
      'Direct ACH owner payout disbursements & ledger transparency',
      'Real-time NOI (Net Operating Income) performance metrics',
      'Secure document sharing for deed, insurance & tax records'
    ],
    tag: 'Owner Relations',
    isAI: false
  },
  {
    id: 'maintenance',
    iconName: 'Wrench',
    title: 'Predictive Maintenance & Work Orders',
    shortDesc: 'AI request triage, automated work order dispatch, vendor recommendation, and repair budget forecasting.',
    fullDesc: 'Convert tenant repair requests instantly into work orders using AI triage. Assign qualified vendors, track maintenance completion dates, manage vendor bills, and triage urgency automatically.',
    benefits: [
      'AI triage of tenant maintenance requests and photos',
      'Vendor assignment & automated work order dispatching',
      'Preventative seasonal maintenance risk forecasting',
      'Automated vendor bill reconciliation and cost tracking'
    ],
    tag: 'AI Operations',
    isAI: true,
    aiTag: 'AI Triage & Dispatch'
  },
  {
    id: 'rent-collection',
    iconName: 'CreditCard',
    title: 'Automated Rent Collection',
    shortDesc: 'Collect rent faster with online ACH, credit card payments, automatic late fees, and recurring autopay.',
    fullDesc: 'Eliminate paper checks with automated online payment processing. Set up auto-pay for tenants, automatically apply grace periods and late fee penalties, and sync transactions directly with your bank.',
    benefits: [
      'Flexible payment options: ACH, Debit, Credit Card & Cash Pay',
      'Automated tenant autopay schedules & payment reminders',
      'Dynamic late fee calculation and automatic ledger posting',
      'Direct bank reconciliation & split payment disbursements'
    ],
    tag: 'Payments & ACH',
    isAI: false
  },
  {
    id: 'accounting',
    iconName: 'Calculator',
    title: 'Smart Accounting & Ledger',
    shortDesc: 'Full double-entry property accounting system built with AI anomaly detection, trust accounts, and bank feeds.',
    fullDesc: 'Separate trust accounts and operating funds with complete double-entry accounting. Built-in AI detects duplicate invoices, uncovers budget anomalies, and reconciles bank feeds automatically.',
    benefits: [
      'AI duplicate invoice & budget anomaly detection',
      'Automated bank feed transaction matching & reconciliation',
      'Double-entry general ledger with customized chart of accounts',
      'Separate trust and operating bank account isolation'
    ],
    tag: 'Smart Accounting',
    isAI: true,
    aiTag: 'AI Anomaly Detection'
  }
];
