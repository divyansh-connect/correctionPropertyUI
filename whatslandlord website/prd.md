# PRD – Premium Property Management SaaS Marketing Website (Frontend Only)

## Project Overview

Build a modern, premium SaaS marketing website for a Property Management Software using **React + Tailwind CSS**.

The website should take **design inspiration** from:

- WhatsLandlord
- AppFolio

**Important:**
Do **NOT** copy any UI, layout, content, or branding directly. The final website must feel original while maintaining an enterprise-level SaaS appearance.

The purpose of this website is to professionally showcase the software, explain its capabilities, generate leads, encourage demo bookings, and prepare the platform for future backend integration.

---

# Tech Stack

- React
- Tailwind CSS
- React Router
- Lucide React Icons
- Framer Motion (optional for smooth animations)

---

# Project Scope

## This is a Frontend Only project.

Do NOT implement:

- Backend
- Authentication
- Database
- API Integration
- CRUD Operations
- Payment Gateway
- Real User Login
- Dashboard Logic
- Role Permissions
- Software Integration

Everything should be static UI only.

---

# Design Direction

The overall UI should feel like a premium enterprise SaaS product.

Take inspiration from:

- WhatsLandlord
- AppFolio

Design characteristics:

- Clean layouts
- Modern SaaS style
- Large whitespace
- Enterprise typography
- Soft shadows
- Rounded cards
- Premium illustrations
- Dashboard mockups
- Smooth scrolling
- Micro animations
- Professional color palette

Avoid cluttered sections.

---

# UI Polish & Visual Mockup Architecture

To ensure a world-class enterprise SaaS presentation matching WhatsLandlord and AppFolio standard:

1. **Hero Floating Analytics & KPI Widgets:**
   - Floating ACH revenue auto-clear card
   - AI lease renewal recommendation badge
   - Maintenance work order resolution timer
   - Live occupancy percentage badge

2. **Context-Specific Marketing Dashboard Mockups:**
   - `HeroMockup`: Hero showcase canvas with ambient glows & floating KPI cards
   - `FinancialDashboardMockup`: Double-entry chart of accounts, trust ledger, live bank reconciliation
   - `PropertyPortfolioMockup`: Unit availability directory, floor plan occupancy badges
   - `MaintenanceCenterMockup`: Work order dispatch queue, photo attachments, vendor status
   - `AIInsightsMockup`: Market rent optimizer, duplicate invoice anomaly detector
   - `OwnerOverviewMockup`: Net distribution ACH payouts, YTD NOI margin, tax vault
   - `TenantPortalMockup`: Resident mobile app, ACH autopay, active lease status
   - `SuperAdminMockup`: Multi-company governance, global audit logs, RBAC controls

3. **Role-Based Visual Previews:**
   - Super Admin -> `SuperAdminMockup`
   - Property Manager -> `PropertyPortfolioMockup`
   - Owner Portal -> `OwnerOverviewMockup`
   - Tenant Portal -> `TenantPortalMockup`

4. **Integrations & Feature Cards:**
   - Bi-directional sync indicators, category badges, subtle hover lifts, mini UI metric snippets.


---

# Website Structure

## 1. Home

Sections:

- Hero Section
- Trusted Companies
- Product Overview
- Dashboard Preview
- Role Based Software Preview
- Core Features
- AI & Automation
- Statistics
- Customer Testimonials
- Pricing Preview
- FAQ Preview
- Call To Action
- Footer

---

## 2. Features

This page explains the software capabilities.

Possible feature sections:

- Property Management
- Tenant Management
- Owner Portal
- Maintenance Management
- Rent Collection
- Accounting
- Reports & Analytics
- AI Assistant
- Communication
- Document Management
- Automation
- Security

These should only explain features.

Do NOT build software functionality.

---

## 3. Solutions

Create separate sections for different users.

Examples:

- Property Managers
- Property Owners
- Tenants
- Maintenance Teams
- Enterprise Companies

Each section should explain how that user benefits from the software.

---

## 4. Pricing

Include:

- Pricing Cards
- Feature Comparison
- CTA Buttons
- FAQ

No payment functionality.

---

## 5. About

Include:

- Company Story
- Mission
- Vision
- Core Values
- Why Customers Trust Us

---

## 6. Blog

Modern blog listing page.

Example categories:

- Property Management
- AI
- Rental Tips
- Accounting
- Maintenance

Only sample content.

---

## 7. Contact

Include:

- Contact Form
- Office Details
- Book Demo CTA
- Google Map Placeholder

No form submission logic.

---

## 8. FAQ

Accordion based FAQ page.

---

# Navbar

Sticky Navbar.

Menu:

- Logo
- Home
- Features
- Solutions
- Pricing
- About
- Blog
- Contact
- Login
- Book Demo

---

# Login Button

Keep the Login button visible in the Navbar.

Current behaviour:

Login Button

↓

Open Existing Login UI

↓

Static Demo Only

Do NOT connect with backend.

Do NOT implement authentication.

Do NOT implement session management.

The login page should remain a UI demonstration only.

---

# Dashboard Preview Strategy

The software already has multiple dashboards.

Do NOT directly place or recreate the complete dashboard screens inside the website.

Instead, create premium showcase sections that visually represent the software.

Each preview should explain what users can accomplish inside the software.

Think of these as marketing previews rather than actual software pages.

---

# Role Based Product Showcase

Create four product showcase sections.

---

## Super Admin

Possible highlights:

- Company Management
- Subscription Management
- Platform Analytics
- User Management
- Business Insights

---

## Property Manager

Possible highlights:

- Property Portfolio
- Tenant Tracking
- Maintenance Requests
- Financial Overview
- Reports & Analytics

---

## Owner Portal

Possible highlights:

- Property Overview
- Income Summary
- Financial Reports
- Statements
- Documents

---

## Tenant Portal

Possible highlights:

- Rent Payments
- Lease Information
- Maintenance Requests
- Documents
- Notifications

---

**Important**

These are only feature highlights.

Do NOT build the actual dashboard.

Do NOT recreate the entire software.

Do NOT implement business logic.

---

# Dashboard Preview Guidelines

Instead of showing the complete software,

Design beautiful dashboard mockups that communicate:

- Simplicity
- Productivity
- Automation
- Analytics
- Property Management

The previews should make visitors understand what the software offers without exposing the full application.

---

# Dashboard Content Rule

Do NOT use every feature available inside the software.

Only highlight the major capabilities.

For example:

Instead of showing every module,

show sections like:

- Property Management
- Financial Insights
- Maintenance Tracking
- Tenant Communication
- Owner Reporting
- AI Automation

This keeps the website clean and focused.

---

# AI Section

Create a premium section explaining AI capabilities.

Possible examples:

- Smart Property Insights
- Automated Reports
- AI Maintenance Suggestions
- Intelligent Notifications
- Portfolio Analytics

These are marketing descriptions only.

---

# Integrations Section

Create a professional integrations section.

Possible integrations:

- Stripe
- QuickBooks
- Google Calendar
- Outlook
- Zapier

Static UI only.

---

# Testimonials

Include modern testimonial cards.

Sample customer reviews only.

---

# Statistics Section

Examples:

- Properties Managed
- Active Users
- Rent Collected
- Maintenance Requests
- Customer Satisfaction

Animated counters only.

Static values.

---

# CTA Sections

Use multiple CTA sections across the website.

Examples:

- Book Demo
- Contact Sales
- Start Free Demo
- Request Consultation

Buttons remain static.

---

# Footer

Include:

- Company
- Product
- Resources
- Support
- Privacy Policy
- Terms
- Social Links

---

# Animations

Use subtle animations.

Examples:

- Fade In
- Fade Up
- Hover Effects
- Card Lift
- Smooth Reveal
- Counter Animation

Avoid excessive motion.

---

# Responsiveness

Support:

- Desktop
- Laptop
- Tablet
- Mobile

Every page should be fully responsive.

---

# Folder Structure

```text
src/
│
├── assets/
├── components/
├── sections/
├── pages/
├── layouts/
├── hooks/
├── data/
├── constants/
├── utils/
├── styles/
└── App.jsx
```

---

# Coding Guidelines

- Build reusable components.
- Keep the code clean and modular.
- Avoid duplicate code.
- Use meaningful component names.
- Follow modern React best practices.

---

# Final Objective

The final result should be a premium SaaS marketing website that looks enterprise-ready and professionally showcases the Property Management Software.

The website must:

- Look modern and premium
- Feel trustworthy
- Be inspired by WhatsLandlord and AppFolio
- Remain completely original
- Showcase the software without recreating it
- Focus on product presentation and lead generation
- Be fully responsive
- Be built only with React + Tailwind CSS
- Remain Frontend Only

No backend, authentication, APIs, database, or software integration should be implemented at this stage.
# Design System & Color Guidelines

The website should follow a premium enterprise SaaS design system inspired by WhatsLandlord and AppFolio, while maintaining its own unique identity.

## Brand Personality

The overall feeling should be:

- Premium
- Modern
- Trustworthy
- Clean
- Professional
- Enterprise
- Minimal
- High-end SaaS

Avoid colorful or playful UI.

---

# Primary Color Palette

## Primary Green

Use a deep forest green as the primary brand color.

Suggested Range:

- #2F4F3A
- #35523D
- #3E5B45

Use for:

- Primary Buttons
- Active Navigation
- Icons
- Highlights
- CTA Sections

---

## Secondary Beige / Warm Background

Use soft warm neutral backgrounds.

Suggested Colors:

- #F7F4EE
- #F5F1E8
- #EFE9DD

Use for:

- Website Background
- Alternate Sections
- Cards
- Dashboard Preview Areas

---

## Accent Gold

Use elegant gold accents sparingly.

Suggested Colors:

- #BFA46A
- #C8AE72

Use for:

- Icons
- Small Highlights
- Badges
- Decorative Elements

Never overuse gold.

---

## Neutral Colors

Dark Text

- #1F2937

Secondary Text

- #6B7280

Light Text

- #9CA3AF

Borders

- #E5E7EB

Cards

- #FFFFFF

---

# Button Styles

Primary Button

- Forest Green Background
- White Text
- Rounded Corners
- Smooth Hover

Secondary Button

- White Background
- Green Border
- Green Text

Text Button

- Minimal
- Underline on Hover

---

# UI Style

The interface should feel:

- Soft
- Elegant
- Spacious
- Premium

Avoid:

- Heavy shadows
- Neon colors
- Bright gradients
- Glassmorphism
- Overly dark themes

---

# Cards

Cards should have:

- White or Warm Beige Background
- Large Border Radius
- Soft Shadow
- Comfortable Padding

---

# Dashboard Preview

Dashboard previews should use:

- White Cards
- Soft Beige Background
- Green Highlights
- Minimal Charts
- Premium Statistics Cards

Do NOT use bright dashboard colors.

---

# Typography

Use modern fonts such as:

- Inter
- Manrope
- Plus Jakarta Sans

Typography should feel clean and professional.

---

# Icons

Use Lucide React Icons only.

Icons should follow the green and neutral color palette.

---

# Overall Visual Direction

The website should visually feel like a combination of:

- WhatsLandlord's clean SaaS experience
- AppFolio's enterprise professionalism

while maintaining a completely original UI and branding.

The entire website should follow one consistent design language from the first section to the footer.