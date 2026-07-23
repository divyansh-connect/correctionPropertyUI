import React from 'react';
import { PageHeader } from '../../components/PageHeader';
import { AIChatWindow } from './components/AIChatWindow';

export const AIAssistantPage: React.FC = () => {
  const suggested = [
    "Show tenants with overdue rent",
    "Which leases expire this month?",
    "Show vacant units",
    "Summarize maintenance requests",
    "Generate a rent roll summary",
    "Show unpaid invoices",
    "Summarize owner statements",
    "Explain this financial report",
    "Generate a late payment reminder"
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Assistant"
        description="Interact with the DoorLoop Copilot to query your rental business operations."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'AI Center' }, { label: 'Assistant' }]}
      />

      <AIChatWindow moduleName="General" suggestedQuestions={suggested} />
    </div>
  );
};
export default AIAssistantPage;
