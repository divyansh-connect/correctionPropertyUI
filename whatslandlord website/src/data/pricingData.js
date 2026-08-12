export const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    badge: 'Essential Tools',
    monthlyPrice: 49,
    annualPrice: 39,
    description: 'Perfect for independent landlords and small property managers scaling up to 50 units.',
    popular: false,
    ctaText: 'Get Started',
    features: [
      'Up to 50 Units Included',
      'Basic Accounting & Ledger',
      'Online Rent Collection (ACH & Credit)',
      'Tenant Screening & Online Applications',
      'Standard Maintenance Work Orders',
      'Basic AI Insights'
    ],
    notIncluded: [
      'Owner Portal Access',
      'Predictive Analytics',
      'Multi-Company Trust Accounting'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    badge: 'Most Popular',
    monthlyPrice: 119,
    annualPrice: 99,
    description: 'Ideal for growing property management companies managing 50 to 500 units.',
    popular: true,
    ctaText: 'Start Free Trial',
    features: [
      'Up to 250 Units Included',
      'Full Double-Entry Property Accounting',
      'Automated Online Rent Collection & Autopay',
      'Dedicated Owner Portal with ACH Payouts',
      'Advanced Maintenance & Vendor Management',
      'Built-in Lease e-Signatures',
      'Predictive Analytics',
      'AI Reports'
    ],
    notIncluded: [
      'AI Copilot & Advanced Automation',
      'Custom API & Webhooks'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    badge: 'Custom Scale',
    monthlyPrice: 249,
    annualPrice: 199,
    description: 'Tailored solutions for large portfolio operators, commercial managers, and enterprise firms (500+ units).',
    popular: false,
    ctaText: 'Contact Sales',
    features: [
      'Unlimited Units & Portfolios',
      'Multi-Entity Trust Chart of Accounts',
      'Super Admin Governance & Custom Roles',
      'AI Copilot',
      'Predictive Intelligence',
      'Portfolio Optimization',
      'Advanced AI Automation',
      'Full REST API & Webhooks Access',
      'Dedicated Account Manager'
    ],
    notIncluded: []
  }
];

export const COMPARISON_MATRIX = [
  {
    category: 'Core Property Management',
    items: [
      { feature: 'Property & Unit Directory', starter: true, pro: true, enterprise: true },
      { feature: 'Tenant Screening & Credit Checks', starter: true, pro: true, enterprise: true },
      { feature: 'Online Application Center', starter: true, pro: true, enterprise: true },
      { feature: 'Lease Expiry Tracking', starter: true, pro: true, enterprise: true },
      { feature: 'Electronic Signature Vault', starter: 'Basic', pro: true, enterprise: true },
    ]
  },
  {
    category: 'Accounting & Rent Collection',
    items: [
      { feature: 'Online Rent Payments (ACH / Credit Card)', starter: true, pro: true, enterprise: true },
      { feature: 'Automated Late Fee Calculation', starter: true, pro: true, enterprise: true },
      { feature: 'Double-Entry Accounting', starter: false, pro: true, enterprise: true },
      { feature: 'Bank Reconciliation Feed', starter: false, pro: true, enterprise: true },
      { feature: 'Direct ACH Owner Payouts', starter: false, pro: true, enterprise: true },
      { feature: 'Multi-Company Trust Accounting', starter: false, pro: false, enterprise: true },
    ]
  },
  {
    category: 'Portals & Collaboration',
    items: [
      { feature: 'Tenant Mobile Portal', starter: true, pro: true, enterprise: true },
      { feature: 'Maintenance & Vendor Hub', starter: 'Basic', pro: true, enterprise: true },
      { feature: 'Owner Self-Service Portal', starter: false, pro: true, enterprise: true },
      { feature: 'Super Admin Governance', starter: false, pro: false, enterprise: true },
    ]
  },
  {
    category: 'AI & Enterprise Capabilities',
    items: [
      { feature: 'Basic AI Insights', starter: true, pro: true, enterprise: true },
      { feature: 'AI Market Rent Optimizer', starter: false, pro: true, enterprise: true },
      { feature: 'Predictive Analytics & AI Reports', starter: false, pro: true, enterprise: true },
      { feature: 'Enterprise AI Copilot & Portfolio Optimization', starter: false, pro: false, enterprise: true },
      { feature: 'Advanced AI Automation', starter: false, pro: false, enterprise: true },
    ]
  }
];
