import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api';
import { PageHeader } from '../../../components/PageHeader';
import { IntegrationCard } from '../components/IntegrationCard';
import { Button } from '../../../components/ui/Button';

export const IntegrationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState('All');

  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ['integrations-marketplace-list'],
    queryFn: () => api.integrations.getAll(),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.integrations.toggle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations-marketplace-list'] });
      alert('Integration status updated.');
    },
  });

  const filtered = activeCategory === 'All'
    ? integrations
    : integrations.filter((i) => i.category === activeCategory);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations Marketplace"
        description="Connect third party applications including payments processors, cloud databases, CRM utilities, and accounting frameworks."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Admin' }, { label: 'Integrations' }]}
      />

      {/* Category Tabs */}
      <div className="flex space-x-2 border-b border-border pb-2 overflow-x-auto">
        {['All', 'Payments', 'Accounting', 'Storage'].map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className="font-semibold whitespace-nowrap"
          >
            {cat}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="h-40 flex items-center justify-center text-muted-foreground">Mapping services...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <IntegrationCard
              key={item.id}
              logo={item.logo}
              name={item.name}
              category={item.category}
              description={item.description}
              status={item.status}
              onToggle={() => toggleMutation.mutate(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default IntegrationsPage;
